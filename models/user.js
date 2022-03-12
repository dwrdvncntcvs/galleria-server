"use strict";
const { Model } = require("sequelize");
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
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: [403, "\nFirst name should not be empty."] },
          notNull: { msg: [403, "\nFirst name should not be empty."] },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: [403, "\nLast name should not be empty."] },
          notNull: { msg: [403, "\nLast name should not be empty."] },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: [403, "Username already exist."] },
        validate: {
          notEmpty: { msg: [403, "\nUsername should not be empty."] },
          notNull: { msg: [403, "\nUsername should not be empty."] },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: [403, "\nEmail address already exist."] },
        validate: {
          notEmpty: { msg: [403, "\nEmail address should not be empty."] },
          notNull: { msg: [403, "\nEmail address should not be empty."] },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: [403, "\nEmail address should not be empty."] },
          notNull: { msg: [403, "\nEmail address should not be empty."] },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  User.findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
  };

  User.findUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
  };
  
  return User;
};
