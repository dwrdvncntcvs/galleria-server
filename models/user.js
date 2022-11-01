"use strict";
const { Sequelize, Op } = require("sequelize");
const { Model } = require("sequelize");
const { hash, genSalt, compare } = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Profile, Follower, Post, Comment, Otp }) {
      this.hasOne(Profile, { foreignKey: "userId" });

      this.hasMany(Follower, { foreignKey: "userId" });

      this.hasMany(Post, { foreignKey: "userId" });

      this.hasMany(Comment, { foreignKey: "userId" });

      this.hasOne(Otp, { foreignKey: "userId" });
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
          // is: {
          //   args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g,
          //   msg: [
          //     403,
          //     "\nPassword must contain at least 8 letters in length, uppercase letters, lowercase letters, one number, and one symbol",
          //   ],
          // },
        },
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
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

  User.createUser = async ({ userData, transaction }) => {
    const { first_name, last_name, username, email, password } = userData;

    return await User.create(
      { first_name, last_name, username, email, password, refreshToken: "" },
      { transaction }
    );
  };

  User.findUserByEmail = async (email) => {
    return await User.findOne({
      where: { email },
    });
  };

  User.findUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
  };

  User.comparePassword = async (password, hashPassword) => {
    return await compare(password, hashPassword);
  };

  User.findUserByUserId = async (id) => {
    return await User.findOne({
      where: { id },
    });
  };

  User.setRefreshToken = async ({ token, userId, transaction }) => {
    return await User.update(
      { refreshToken: token },
      { where: { id: userId } },
      { transaction }
    );
  };

  User.getRefreshTokenByUserId = async (userId) => {
    return await User.findOne({ where: { id: userId } });
  };

  User.getRefreshToken = async (token) => {
    return await User.findOne({ where: { refreshToken: token } });
  };

  User.removeRefreshTokenByUserId = async ({ userId, transaction }) => {
    return await User.update(
      { refreshToken: "" },
      { where: { id: userId } },
      { transaction }
    );
  };

  User.getUserProfileByUsername = async (username) => {
    const { Profile, Sequelize } = require("../models");

    return await User.findOne({
      where: { username },
      attributes: { exclude: ["password", "updatedAt"] },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["id", "createdAt", "updatedAt", "userId"] },
        },
      ],
    });
  };

  User.changeUserPassword = async ({ password, userId, transaction }) => {
    const salt = await genSalt(10, "a");
    const hashPass = await hash(password, salt);

    return await User.update(
      { password: hashPass },
      { where: { id: userId } },
      { transaction }
    );
  };

  User.verifyUser = async ({ userId, transaction }) => {
    return await User.update(
      { verified: true },
      { where: { id: userId } },
      transaction
    );
  };

  User.getRandomUserProfile = async (userId) => {
    const { sequelize, Profile, Follower } = require("../models");

    const following = await Follower.getFollowing(userId);
    const userIdArr = getUsersId(following);

    return await User.findAll({
      where: {
        verified: true,
        id: { [Op.notIn]: [userId, ...userIdArr] },
      },
      order: sequelize.random(),
      limit: 5,
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["id", "createdAt", "updatedAt", "userId"] },
        },
      ],
    });
  };

  User.searchUser = async (searchChar) => {
    const { Op } = require("sequelize");
    const { Profile } = require("../models");

    console.log("Searching ... ", searchChar);
    return User.findAndCountAll({
      where: {
        [Op.or]: {
          first_name: { [Op.iLike]: `%${searchChar}%` },
          last_name: { [Op.iLike]: `%${searchChar}%` },
          username: { [Op.iLike]: `%${searchChar}%` },
        },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Profile,
          attributes: {
            exclude: [
              "id",
              "createdAt",
              "updatedAt",
              "userId",
              "bio",
              "contactNumber",
              "dateOfBirth",
              "address",
            ],
          },
        },
      ],
    });
  };

  User.updateUserAccount = async ({ id }, data, { transaction }) => {
    const { Profile } = require("../models");

    await User.update(
      { username: data.username },
      { where: { id } },
      { transaction }
    );

    await Profile.update(
      { contactNumber: data.contactNumber },
      { where: { userId: id } },
      { transaction }
    );

    await transaction.commit();

    return data;
  };

  return User;
};

const getUsersId = (arrData) => {
  return arrData.userData.map((user) => {
    const { id } = user.dataValues;
    return id;
  });
};
