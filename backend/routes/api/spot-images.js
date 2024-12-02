const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage } = require("../../db/models");
const { param } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateImageId = [
  param("imageId")
    .isInt()
    .withMessage("imageId must be an integer")
    .toInt(),
  handleValidationErrors,
];

router.get(
  "/:imageId",
  [
    // requireAuth,
    validateImageId,
  ],
  async (req, res) => {
    const { imageId } = req.params;

    const image = await SpotImage.findByPk(imageId);
    if (!image) {
      return res.status(404).json({
        message: "Spot Image " + imageId + " could not be found",
      });
    }
    return res.json({ image });
  },
);

router.delete(
  "/:imageId",
  [requireAuth, validateImageId],
  async (req, res) => {
    const { user } = req;
    const { imageId } = req.params;

    const image = await SpotImage.findByPk(imageId, {
      include: { model: Spot, attributes: ["ownerId"] },
    });

    if (!image) {
      return res
        .status(404)
        .json({ message: "Spot Image couldn't be found" });
    }

    if (image.Spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    image.destroy();
    return res.json({ message: "Successfully deleted" });
  },
);

module.exports = router;
