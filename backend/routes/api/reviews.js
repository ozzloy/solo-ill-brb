const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
} = require("../../db/models");

const router = express.Router("/reviews");

// Get all Reviews of the Current User
router.get("/current", async (req, res) => {
  const { user } = req;

  const reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.status(200).json({ reviews });
});

module.exports = router;
