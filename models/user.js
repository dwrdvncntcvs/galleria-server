"use strict";
const { Model } = require("sequelize");
const { hash, genSalt, compare } = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Profile, Avatar, Follower }) {
      this.hasOne(Profile, { foreignKey: "userId" });
      this.hasOne(Avatar, { foreignKey: "userId" });
      this.hasMany(Follower, { foreignKey: "userId" });
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
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g,
            msg: [
              403,
              "\nPassword must contain at least 8 letters in length, uppercase letters, lowercase letters, one number, and one symbol",
            ],
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        beforeCreate: async (user) => {
          const salt = await genSalt(10, "a");
          user.password = await hash(user.password, salt);
        },
      },
    }
  );

  User.findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
  };

  User.findUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
  };

  User.comparePassword = async (password, hashPassword) => {
    return await compare(password, hashPassword);
  };

  User.findUserByUserId = async (id) => {
    return await User.findOne({ where: { id } });
  };

  return User;
};
