"use strict";

const sequelize = require("sequelize");
const { Model, fn, col } = sequelize;
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        as: "Owner",
        foreignKey: "ownerId",
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        sourceKey: "id",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        sourceKey: "id",
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        sourceKey: "id",
      });
      Spot.addScope("withAverageRating", (fieldName = "avgRating") => ({
        include: [
          {
            model: models.Review,
            attributes: [],
          },
        ],
        attributes: {
          include: [[fn("ROUND", fn("AVG", col("Reviews.stars"))), fieldName]],
        },
        group: ["Spot.id"],
        subQuery: false,
      }));
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      address: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isPositive(value) {
            if (value <= 0) {
              throw new Error("Price per day must be a positive number");
            }
          },
        },
      },
      previewImage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "SpotImages",
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    },
  );
  return Spot;
};
