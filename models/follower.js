"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        hooks: true,
        onDelete: "cascade",
        targetKey: "id",
      });
    }
  }
  Follower.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      followerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follower",
      tableName: "followers",
    }
  );

  Follower.isUserFollowed = async (foundUser, user) => {
    if (!foundUser) return false;

    return (await Follower.findOne({
      where: {
        userId: foundUser.id,
        followerId: user.id,
      },
    }))
      ? true
      : false;
  };

  Follower.getFollowers = async (userId) => {
    const followerData = await Follower.findAll({ where: { userId } });

    const users = await Follower.getUser(followerData, "followers");

    return { userData: users, count: users.length };
  };

  Follower.getFollowing = async (userId) => {
    const followingData = await Follower.findAll({
      where: { followerId: userId },
    });

    const users = await Follower.getUser(followingData, "following");

    return { userData: users, count: users.length };
  };

  Follower.getUser = async (userData, followType) => {
    const parameter = followType === "following" ? "userId" : "followerId";
    console.log("Parameters: ", parameter);
    return await Promise.all(
      userData.map(async (data) => {
        const { User, Avatar } = require("../models");

        const user = await User.findOne({
          where: { id: data[parameter] },
          attributes: { exclude: ["password"] },
          include: [{ model: Avatar }],
        });

        return user;
      })
    );
  };
  return Follower;
};
