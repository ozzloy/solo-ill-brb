"use strict";

const { Spot } = require("../models");

let options = {};
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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        avgRating: 4.5,
        previewImage: "image url",
      },
      {
        ownerId: 2,
        address: "156 invented road",
        city: "San Pancho",
        state: "Arizona",
        country: "United States of America",
        lat: 34.7456358,
        lng: -222.4784327,
        name: "Spot 2",
        description: "Place where web developers are exploded",
        price: 555,
        avgRating: 1,
        previewImage: "image url",
      },
      {
        ownerId: 1,
        address: "45224 Mickey Lane",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 31.7678558,
        lng: -132.4518927,
        name: "Mars",
        description: "BIP BIP BOP BOP ",
        price: 515.65,
        avgRating: 5,
        previewImage: "image url",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
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
