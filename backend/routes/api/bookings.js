const { Booking, Spot } = require("../../db/models");
const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router("/bookings");

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [{ model: Spot }],
  });

  return res.json({ Bookings: bookings });
});

module.exports = router;
