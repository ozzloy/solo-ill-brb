const express = require("express");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const { Spot } = require("../../db/models");

const router = express.Router("/spots");

// Get all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();

  res.status(200).json(spots);
});

module.exports = router;
