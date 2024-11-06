"use strict";

const { Booking } = require("../models");

const bookings = [
  {
    userId: 1,
    spotId: 2,
    startDate: new Date("2024-11-15T14:00:00.000Z"),
    endDate: new Date("2024-11-20T11:00:00.000Z"),
  },
  {
    userId: 1,
    spotId: 2,
    startDate: new Date("2024-11-25T14:00:00.000Z"),
    endDate: new Date("2024-11-26T11:00:00.000Z"),
  },
  {
    userId: 2,
    spotId: 1,
    startDate: new Date("2111-01-02T14:00:00.000Z"),
    endDate: new Date("2111-01-03T11:00:00.000Z"),
  },
  {
    userId: 2,
    spotId: 1,
    startDate: new Date("2024-12-01T14:00:00.000Z"),
    endDate: new Date("2024-12-09T11:00:00.000Z"),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bookings", {
      [Sequelize.Op.or]: bookings.map((booking) => ({
        userId: booking.userId,
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate,
      })),
    });
  },
};
