const express = require("express");
const { Op, fn, col } = require("sequelize");
const { check } = require("express-validator");
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
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  req.spot = spot;
  next();
};

// Get all Spots
router.get("/", async (_req, res) => {
  const spots = await Spot.scope({ method: ["withAverageRating"] }).findAll();

  return res.status(200).json({ Spots: spots });
});

//Get spots of current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const spots = await Spot.scope({ method: ["withAverageRating"] }).findAll({
    where: { ownerId: user.id },
  });

  return res.status(200).json({ Spots: spots });
});

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", requireAuth, async (req, res) => {
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
});

router.get("/:spotId/bookings", async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const { user } = req;
  const spot = await Spot.findByPk(spotIdNumber, {
    include: [{ model: User, as: "Owner", attributes: ["id"] }],
  });
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  const isOwner = spot.ownerId == user.id;
  const bookings = await Booking.scope(
    isOwner ? "ownerView" : "nonOwnerView",
  ).findAll({ where: { spotId: spotIdNumber } });

  return res.json({ Bookings: bookings });
});

router.post("/:spotId/bookings", async (req, res) => {
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
  const { startDate: startDateString, endDate: endDateString } = req.body;

  const spot = await Spot.findByPk(spotIdNumber, {
    include: [{ model: User, as: "Owner", attributes: ["id"] }],
  });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const errors = {};

  const requestStart = new Date(startDateString);
  requestStart.setHours(12, 0, 0, 0);
  const requestEnd = new Date(endDateString);
  requestEnd.setHours(12, 0, 0, 0);

  const now = new Date();
  now.setHours(12, 0, 0, 0);

  /**
     if startDate is before now
       errors.startDate = "startDate cannot be in the past";
     */
  if (requestStart < now) {
    errors.startDate = "startDate cannot be in the past";
  }
  /**
     if endDate is on or before startDate,
       errors.endDate = "endDate cannot be on or before startDate";
     */
  if (requestEnd <= requestStart) {
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
       find all bookings where the requestStart is in between
       the booking's startDate and endDate,

       or the booking's startDate is in between the requestStart
       and requestEnd
       */
    where: {
      spotId: spot.id,
      [Op.or]: [
        // requested start date falls within existing booking
        {
          [Op.and]: [
            { startDate: { [Op.lte]: requestStart } },
            { endDate: { [Op.gte]: requestStart } },
          ],
        },
        // extant start date falls within requested booking
        {
          [Op.and]: [
            { startDate: { [Op.gte]: requestStart } },
            { startDate: { [Op.lte]: requestEnd } },
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
    const startDateConflicts = overlappingBookings.some((booking) => {
      const extantStart = new Date(booking.startDate);
      extantStart.setHours(12, 0, 0, 0);
      const extantEnd = new Date(booking.endDate);
      extantEnd.setHours(12, 0, 0, 0);

      return extantStart <= requestStart && requestStart <= extantEnd;
    });
    if (startDateConflicts) {
      errors.startDate = "Start date conflicts with an existing booking";
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
      extantStart.setHours(12, 0, 0, 0);
      const extantEnd = new Date(booking.endDate);
      extantEnd.setHours(12, 0, 0, 0);

      return extantStart <= requestStart && requestStart <= extantEnd;
    });
    if (endDateConflicts) {
      errors.endDate = "End date conflicts with an existing booking";
    }

    // if neither the start nor end requested date is in between
    //   an extant booking's start and end, then the extant is
    //   completely inside the requested booking
    if (!(startDateConflicts || endDateConflicts)) {
      errors.startDate = "Start date conflicts with an existing booking";
      errors.endDate = "End date conflicts with an existing booking";
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
    startDate: requestStart,
    endDate: requestEnd,
  });
  return res.status(201).json(booking);
});

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
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotIdNumber);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
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

//Get spots by Id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);

  const spot = await Spot.scope({
    method: ["withAverageRating", "avgStarRating"],
  }).findOne({
    attributes: {
      exclude: ["previewImage"],
      include: [[fn("COUNT", col("Reviews.id")), "numReviews"]],
    },
    where: { id: spotIdNumber },
    include: [
      { model: SpotImage, attributes: ["id", "url"] },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        attributes: [],
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
    element.preview = element.id === spotJson.id;
  });
  return res.status(200).json(spotJson);
});

const validateSpot = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("country").notEmpty().withMessage("Country is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("price")
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

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
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

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

  await spot.update({
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

  return res.status(200).json(spot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spotIdNumber = parseInt(spotId);
  const spot = await Spot.findByPk(spotIdNumber);
  const userId = req.user.id;

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
