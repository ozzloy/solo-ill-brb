const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const { imageId } = req.params;
  const imageIdNumber = parseInt(imageId);

  const image = await SpotImage.findByPk(imageIdNumber, {
    include: { model: Spot, attributes: ["ownerId"] },
  });

  if (!image) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  if (image.Spot.ownerId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  image.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
