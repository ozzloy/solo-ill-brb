"use strict";

const { SpotImage } = require("../models");

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotImages = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/14_Strada_Vasile_Conta%2C_Bucharest_%2802%29.jpg/477px-14_Strada_Vasile_Conta%2C_Bucharest_%2802%29.jpg",
    spotId: 1,
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg/640px-Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_%28Hokan-ji_Temple%29%2C_Kyoto%2C_Japan.jpg",
    spotId: 2,
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cam0492_Habitation_de_Pouss.jpg/640px-Cam0492_Habitation_de_Pouss.jpg",
    spotId: 3,
  },
];

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
    await SpotImage.bulkCreate(spotImages);
  },

  async down(queryInterface, _Sequelize) {
    options.tableName = "SpotImages";
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
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      { [Op.or]: spotImages },
      {},
    );
  },
};
