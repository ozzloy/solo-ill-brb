"use strict";

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "SpotImages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Spots",
          },
          onDelete: "CASCADE",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options,
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.dropTable(options);
  },
};
