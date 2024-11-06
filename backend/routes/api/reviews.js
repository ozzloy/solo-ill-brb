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

const router = express.Router("/reviews");

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  const review = await Review.findOne({
    where: { id: reviewId },
  });

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const totalImages = await ReviewImage.count({
    where: { reviewId },
  });

  if (totalImages >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const image = await ReviewImage.create({
    url,
    reviewId,
  });

  return res.status(201).json({ id: image.id, url: image.url });
});

const validateReview = [
  check("review").notEmpty().withMessage("Review text is required"),
  check("stars")
    .notEmpty()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];
// Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  let existingReview = await Review.findOne({
    where: { id: reviewId },
  });

  if (!existingReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (existingReview.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await existingReview.update({
    review,
    stars,
  });

  return res.status(200).json(existingReview);
});

//Delete a review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  let review = await Review.findOne({
    where: { id: reviewId },
  });

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await review.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
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

  return res.status(200).json({ Reviews: reviews });
});

module.exports = router;
