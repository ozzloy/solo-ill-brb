const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
} = require("../../db/models");
const { where } = require("sequelize");

const router = express.Router("/reviews");

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  const review = await Review.findOne({
    where: { id: reviewId, userId },
  });

  if (!review) {
    res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const totalImages = await ReviewImage.count({
    where: { reviewId },
  });

  if (totalImages >= 10) {
    res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const image = await ReviewImage.create({
    url,
    reviewId,
  });

  res.status(201).json({ id: image.id, url: image.url });
});

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
