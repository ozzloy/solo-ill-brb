'use strict';

const {User} = require('./user')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User
      }
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.NUMERIC,
    lng: DataTypes.NUMERIC,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.NUMERIC,
    avgRating: DataTypes.INTEGER,
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};