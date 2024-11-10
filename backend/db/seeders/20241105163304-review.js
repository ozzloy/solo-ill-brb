"use strict";

const { Review } = require("../models");

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Review.bulkCreate(
      [
        {
          userId: 1,
          spotId: 1,
          review: "This was an awesome spot!",
          stars: 5,
        },
        {
          userId: 2,
          spotId: 2,
          review: "This was a horrible spot!",
          stars: 1,
        },
        {
          userId: 3,
          spotId: 3,
          review: "Martians are so nice",
          stars: 4,
        },
        {
          userId: 3,
          spotId: 1,
          review: "Meh!",
          stars: 2,
        },
      ],
      options,
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      { userId: { [Op.in]: [1, 2, 3] } },
      {},
    );
  },
};
