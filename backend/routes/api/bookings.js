const { Booking, Spot } = require("../../db/models");
const express = require("express");

const router = express.Router("/bookings");

router.get("/current", async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [{ model: Spot }],
  });

  res.json({ Bookings: bookings });
});

module.exports = router;
