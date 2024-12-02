"use strict";

const { SpotImage } = require("../models");

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotImages = [
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/14_Strada_Vasile_Conta,_Bucharest_(02).jpg",
    spotId: 1,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_(Hokan-ji_Temple),_Kyoto,_Japan.jpg",
    spotId: 2,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/Cam0492_Habitation_de_Pouss.jpg",
    spotId: 3,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/Deras-TreeHouse.JPG",
    spotId: 4,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/248_Ashley_Ave_-_2017.jpg",
    spotId: 1,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/255px-103_Hanover.jpg",
    spotId: 1,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/261px-9,_Strada_Mitropolit_Nifon,_Bucharest_(Romania).jpg",
    spotId: 2,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/320px-Casa_Assan_1.jpg",
    spotId: 2,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/640px-Katsura_Imperial_Villa_in_Spring.jpeg",
    spotId: 3,
  },
  {
    url: "https://each.do/~ozzloy/solo-ill-brb/Bamboo_House_in_Sambava_Madagascar.JPG",
    spotId: 4,
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
