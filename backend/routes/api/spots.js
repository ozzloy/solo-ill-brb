const express = require("express");
const { Op, fn, col } = require("sequelize");

//TODO use body and query instead of "check"
const { check, query, body } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const {
  Booking,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
  User,
} = require("../../db/models");

const router = express.Router("/spots");

// TODO use this middleware in all endpoints that can use it
const requireSpotExists = async (req, res, next) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const spot = await Spot.findByPk(spotIdNumber);
  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot couldn't be found" });
  }
  req.spot = spot;
  return next();
};

const validateQuery = [
  query("page")
    .optional()
    .default(1)
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1")
    .toInt(),
  query("size")
    .optional()
    .default(20)
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20")
    .toInt(),
  query("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid")
    .toFloat(),
  query("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid")
    .toFloat(),
  query("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid")
    .toFloat(),
  query("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid")
    .toFloat(),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0")
    .toFloat(),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0")
    .toFloat(),
  handleValidationErrors,
];
// Get all Spots
router.get("/", validateQuery, async (req, res) => {
  const { query } = req;
  query.page ||= 1;
  query.size ||= 20;
  const {
    page,
    size,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = query;
  const where = {
    ...(minLat && { lat: { [Op.gte]: minLat } }),
    ...(maxLat && { lat: { [Op.lte]: maxLat } }),
    ...(minLng && { lng: { [Op.gte]: minLng } }),
    ...(maxLng && { lng: { [Op.lte]: maxLng } }),
    ...(minPrice && { price: { [Op.gte]: minPrice } }),
    ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
  };
  const offset = (page - 1) * size;
  const limit = size;
  const spots = await Spot.scope({
    method: ["withAverageRating"],
  }).findAll({
    where,
    offset,
    limit,
  });

  return res.status(200).json({ Spots: spots, page, size });
});

//Get spots of current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const spots = await Spot.scope({
    method: ["withAverageRating"],
  }).findAll({
    where: { ownerId: user.id },
  });

  return res.status(200).json({ Spots: spots });
});

// Get all Reviews by a Spot's id
router.get(
  "/:spotId/reviews",
  /*requireAuth,*/ async (req, res) => {
    const { spotId } = req.params;
    const spotIdNumber = parseInt(spotId);

    const spot = await Spot.findByPk(spotIdNumber);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const reviews = await Review.findAll({
      where: {
        spotId: spotIdNumber,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    return res.status(200).json({ Reviews: reviews });
  },
);

router.get("/:spotId/bookings", async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const { user } = req;
  const spot = await Spot.findByPk(spotIdNumber, {
    include: [{ model: User, as: "Owner", attributes: ["id"] }],
  });
  if (!spot)
    return res
      .status(404)
      .json({ message: "Spot couldn't be found" });
  const isOwner = spot.ownerId == user.id;
  const bookings = await Booking.scope(
    isOwner ? "ownerView" : "nonOwnerView",
  ).findAll({ where: { spotId: spotIdNumber } });

  return res.json({ Bookings: bookings });
});

const justTheDate = (value) => {
  const date = new Date(value);
  return new Date(date.toISOString().split("T")[0]);
};
const verifyMakeBooking = [
  requireAuth,
  body("startDate")
    .isISO8601()
    .withMessage("startDate must be in iso 8601 acceptable format")
    .isAfter(new Date().toDateString())
    .withMessage("startDate cannot be in the past")
    .customSanitizer(justTheDate),
  body("endDate")
    .isISO8601()
    .withMessage("endDate must be in iso 8601 acceptable format")
    .customSanitizer(justTheDate)
    .custom((endDate, { req }) => {
      const { body } = req;
      const { startDate } = body;
      if (endDate <= startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];
router.post(
  "/:spotId/bookings",
  verifyMakeBooking,
  async (req, res) => {
    /**
     request body looks like this:

    ```json
    {
      "startDate": "2021-11-19",
      "endDate": "2021-11-20"
    }
    ```
     */
    const { spotId } = req.params;
    const spotIdNumber = parseInt(spotId);
    const { user } = req;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotIdNumber, {
      include: [{ model: User, as: "Owner", attributes: ["id"] }],
    });

    if (!spot)
      return res
        .status(404)
        .json({ message: "Spot couldn't be found" });

    const errors = {};

    const now = justTheDate(Date.now());

    /**
     if startDate is before now
       errors.startDate = "startDate cannot be in the past";
     */
    if (startDate < now) {
      errors.startDate = "startDate cannot be in the past";
    }
    /**
     if endDate is on or before startDate,
       errors.endDate = "endDate cannot be on or before startDate";
     */
    if (endDate <= startDate) {
      errors.endDate = "endDate cannot be on or before startDate";
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    /**
     find all the bookings for this spot.
     */
    const overlappingBookings = await Booking.findAll({
      /**
       find all bookings where the startDate is in between
       the booking's startDate and endDate,

       or the booking's startDate is in between the startDate
       and endDate
       */
      where: {
        spotId: spot.id,
        [Op.or]: [
          // requested start date falls within existing booking
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: startDate } },
            ],
          },
          // extant start date falls within requested booking
          {
            [Op.and]: [
              { startDate: { [Op.gte]: startDate } },
              { startDate: { [Op.lte]: endDate } },
            ],
          },
        ],
      },
    });
    if (0 < overlappingBookings.length) {
      /**
       if the startDate is in between the startDate
       and endDate for any existing booking for this spot,
         errors.push({
           startDate: "Start date conflicts with an existing booking"
         })
       */
      const startDateConflicts = overlappingBookings.some(
        (booking) => {
          const extantStart = new Date(booking.startDate);
          const extantEnd = new Date(booking.endDate);

          const condition =
            extantStart <= startDate && startDate <= extantEnd;
          return condition;
        },
      );
      if (startDateConflicts) {
        errors.startDate =
          "Start date conflicts with an existing booking";
      }
      /**
       if the endDate is in between the startDate
       and endDate for any existing booking for this spot,
         errors.push({
           endDate: "End date conflicts with an existing booking"
         })
       */
      const endDateConflicts = overlappingBookings.some((booking) => {
        const extantStart = new Date(booking.startDate);
        const extantEnd = new Date(booking.endDate);

        return extantStart <= endDate && endDate <= extantEnd;
      });
      if (endDateConflicts) {
        errors.endDate =
          "End date conflicts with an existing booking";
      }

      // if neither the start nor end requested date is in between
      //   an extant booking's start and end, then the extant is
      //   completely inside the requested booking
      if (!(startDateConflicts || endDateConflicts)) {
        errors.startDate =
          "Start date conflicts with an existing booking";
        errors.endDate =
          "End date conflicts with an existing booking";
      }

      const message =
        "Sorry, this spot is already booked for the specified dates";
      return res.status(403).json({ message, errors });
    }
    /**
     success!
     return information about the booking that was just created
     status 201
     response body looks like this
    ```json
    {
      "id": 1,
      "spotId": 1,
      "userId": 2,
      "startDate": "2021-11-19",
      "endDate": "2021-11-20",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```
     */
    const booking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate,
      endDate,
    });
    return res.status(201).json(booking);
  },
);

const validateReview = [
  check("review").notEmpty().withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  requireSpotExists,
  async (req, res) => {
    const { spot, user } = req;

    const existingReview = await Review.findOne({
      where: { userId: user.id, spotId: spot.id },
    });

    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this spot",
      });
    } else {
      let { review, stars } = req.body;
      stars = parseInt(stars);

      const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars,
      });

      return res.status(201).json(newReview);
    }
  },
);

//Post an image based on a SpotId
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const { url, preview } = req.body;
  const userId = parseInt(req.user.id);
  const spot = await Spot.findByPk(spotIdNumber);
  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const spotImage = await SpotImage.create({
    spotId: spotIdNumber,
    url,
  });
  if (preview) {
    spot.set("previewImage", spotImage.id);
  }
  const response = { id: spotImage.id, url: spotImage.url, preview };

  return res.status(201).json(response);
});

//Get spot by Id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);

  const spot = await Spot.findByPk(spotIdNumber, {
    include: [
      { model: SpotImage, attributes: ["id", "url"] },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        attributes: ["stars", "id"],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const spotJson = spot.toJSON();
  spotJson.SpotImages.forEach((element) => {
    element.preview = element.id === spotJson.previewImage;
  });
  const numReviews = spotJson.Reviews.length;
  const avgStarRating = spotJson.Reviews.length
    ? spotJson.Reviews.reduce(
        (sum, review) => sum + review.stars,
        0,
      ) / numReviews
    : 0.0;
  const { Reviews, previewImage, ...formattedSpot } = spotJson;
  formattedSpot.numReviews = numReviews;
  formattedSpot.avgStarRating = avgStarRating;
  return res.status(200).json(formattedSpot);
});

const validateSpot = [
  check("address")
    .notEmpty()
    .withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  check("country").notEmpty().withMessage("Country is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90")
    .toFloat(),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180")
    .toFloat(),
  check("name")
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("price")
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage("Price per day must be a positive number")
    .toFloat(),
  handleValidationErrors,
];

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;

  const { user } = req;

  const spot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.status(201).json(spot);
});

// Edit a Spot
router.put(
  "/:spotId",
  requireAuth,
  validateSpot,
  async (req, res) => {
    const { spotId } = req.params;
    const spotIdNumber = parseInt(spotId);

    const userId = req.user.id;

    const spot = await Spot.findByPk(spotIdNumber);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spot.update(req.body);

    return res.status(200).json(spot);
  },
);

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const spot = await Spot.findByPk(spotIdNumber);
  const userId = parseInt(req.user.id);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await spot.destroy();

  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
