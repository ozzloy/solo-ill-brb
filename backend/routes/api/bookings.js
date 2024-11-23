const { Booking, Spot } = require("../../db/models");
const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router("/bookings");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  return res.json({ Bookings: bookings });
});

const validateBooking = [
  check("startDate")
    .isAfter(new Date().toISOString().split("T")[0])
    .withMessage("startDate cannot be in the past"),
  check("endDate").custom((value, { req }) => {
    const { startDate } = req.body;
    if (new Date(value) <= new Date(startDate)) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  handleValidationErrors,
];

// Edit a Booking
router.put("/:bookingId", requireAuth, validateBooking, async (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const userId = parseInt(req.user.id);

  const booking = await Booking.findOne({
    where: { id: bookingId, userId },
  });

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  const bookingEndDate = new Date(booking.endDate);
  const currentDate = new Date();

  if (bookingEndDate < currentDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const { startDate, endDate } = req.body;

  //this will return an array of objects
  // example:
  /*
  [
  {startDate: '2024-11-01'}
  {startDate: '2024-11-06'}
  {endDate: '2024-11-17'}
  ]
  */
  const allBookedDates = await Booking.findAll({
    where: { id: bookingId },
    attributes: ["startDate", "endDate"],
  });

  /*this will return an array with the Date values
  [
  '2024-11-01',
  '2024-11-01',
  '2024-11-02'
  ]
  */

  const bookedDates = allBookedDates.flatMap((booking) => [
    new Date(booking.startDate).toISOString().split("T")[0],
    new Date(booking.endDate).toISOString().split("T")[0],
  ]);

  if (bookedDates.includes(startDate) || bookedDates.includes(endDate)) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  await booking.update({
    startDate,
    endDate,
  });

  return res.status(200).json(booking);
});

module.exports = router;
