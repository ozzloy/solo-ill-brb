"use strict";

const { Review, User, Spot } = require("../models");

const options = {};
if (process.env.NODE_ENV === "production") {
  // define your schema in options object
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(_queryInterface, _Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const demoUser = await User.findOne({
      where: { email: "demo@example.com" },
    });

    const user2 = await User.findOne({
      where: { email: "user2@example.com" },
    });

    const user3 = await User.findOne({
      where: { email: "user3@example.com" },
    });

    const spot1 = await Spot.findOne({
      where: { ownerId: demoUser.id, name: "App Academy" },
    });

    const spot2 = await Spot.findOne({
      where: { ownerId: user2.id, name: "Spot 2" },
    });

    const spot3 = await Spot.findOne({
      where: { ownerId: demoUser.id, name: "Mars" },
    });

    await Review.bulkCreate(
      [
        {
          userId: demoUser.id,
          spotId: spot1.id,
          review: "This was an awesome spot!",
          stars: 5,
          createdAt: new Date("2000-01-01T12:00:00Z"),
          updatedAt: new Date("2000-01-01T12:00:00Z"),
        },
        {
          userId: user2.id,
          spotId: spot2.id,
          review: "This was a horrible spot!",
          stars: 1,
        },
        {
          userId: user3.id,
          spotId: spot3.id,
          review: "Martians are so nice",
          stars: 4,
        },
        {
          userId: user3.id,
          spotId: spot1.id,
          review: "Meh!",
          stars: 2,
        },
      ],
      { ...options, returning: true },
    );
  },

  async down(queryInterface, _Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options, null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },

  async oldDown(queryInterface, Sequelize) {
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
