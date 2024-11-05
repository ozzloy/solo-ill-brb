const express = require("express");
const bcrypt = require("bcryptjs");
const { Op, where } = require("sequelize");

const { Spot, SpotImage, User } = require("../../db/models");

const router = express.Router("/spots");

// Get all Spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll();

  res.status(200).json(spots);
});

router.get("/current", async (req, res) => {
  const { user } = req;

  const spots = await Spot.findAll({
    where: { ownerId: user.id },
  });

  res.status(200).json({ Spots: spots });
});

router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  res.status(200).json(spot);
});
module.exports = router;
