'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.CHAR,
    lastName: DataTypes.CHAR,
    email: DataTypes.CHAR,
    username: DataTypes.CHAR,
    password_hash: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};