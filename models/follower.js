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
  return Follower;
};
