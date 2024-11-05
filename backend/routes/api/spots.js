const express = require("express");
const bcrypt = require("bcryptjs");
const { Op, where } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
} = require("../../db/models");

const router = express.Router("/spots");

// Get all Spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll();

  res.status(200).json(spots);
});

//Get spots of current user
router.get("/current", async (req, res) => {
  const { user } = req;

  const spots = await Spot.findAll({
    where: { ownerId: user.id },
  });

  res.status(200).json({ Spots: spots });
});

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const reviews = await Review.findAll({
    where: {
      spotId,
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
  res.status(200).json({ reviews });
});

//Post an image based on a SpotId
router.post("/:spotId/images", async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  const spotImage = await SpotImage.create({
    spotId,
    url,
  });
  if (preview) {
    spot.set("previewImage", spotImage.id);
  }
  const response = { id: spotImage.id, url: spotImage.url, preview };

  res.status(201).json(response);
});

//Get spots by Id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  const spotJson = spot.toJSON();
  spotJson.SpotImages.forEach((element) => {
    element.preview = element.id === spotJson.id;
  });
  res.status(200).json(spotJson);
});

const validateSpot = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
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

router.post("/", validateSpot, async (req, res) => {
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

  res.status(201).json(spot);
});

router.put("/:spotId", validateSpot, async (req, res) => {
  const { spotId } = req.params;

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const { user } = req;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
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

  res.status(200).json(spot);
});

router.delete("/:spotId", async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
