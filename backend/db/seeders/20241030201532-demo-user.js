"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "primus",
          lastName: "maximus",
          email: "demo@example.com",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "chungus",
          lastName: "amongus",
          email: "user2@example.com",
          username: "turkeylurkey",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "third",
          lastName: "word",
          email: "user3@example.com",
          username: "honk",
          hashedPassword: bcrypt.hashSync("password3"),
        },
      ],
      { validate: true },
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {},
    );
  },
};
