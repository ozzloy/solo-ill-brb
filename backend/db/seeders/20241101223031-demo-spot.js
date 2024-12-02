"use strict";

const { Spot, User } = require("../models");

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
    const demoUser = await User.findOne({
      where: { email: "demo@example.com" },
    });

    const user2 = await User.findOne({
      where: { email: "user2@example.com" },
    });

    const user3 = await User.findOne({
      where: { email: "user3@example.com" },
    });

    await Spot.bulkCreate([
      {
        ownerId: demoUser.id,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        previewImage: 1,
      },
      {
        ownerId: user2.id,
        address: "156 invented road",
        city: "San Pancho",
        state: "Arizona",
        country: "United States of America",
        lat: 34.7456358,
        lng: -222.4784327,
        name: "Spot 2",
        description: "Place where web developers are exploded",
        price: 555,
        previewImage: 2,
      },
      {
        ownerId: demoUser.id,
        address: "45224 Mickey Lane",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 31.7678558,
        lng: -132.4518927,
        name: "Mars",
        description: "BIP BIP BOP BOP",
        price: 515.65,
        previewImage: 3,
      },
      {
        ownerId: user3.id,
        address: "1600 pennsylvania avenue",
        city: "beverly hills",
        state: "california",
        country: "united states of america",
        // 38.89767 -77.03655
        lat: 38.89767,
        lng: -77.03655,
        name: "happiest place on earth",
        description: "we juggle on sundays at the lighthouse",
        price: 420.69,
        previewImage: 4,
      },
    ]);
  },

  async down(queryInterface, _Sequelize) {
    options.tableName = "Spots";
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["App Academy", "Spot 2", "Mars"] },
      },
      {},
    );
  },
};
