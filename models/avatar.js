"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
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
  Avatar.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mimetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Avatar",
      tableName: "avatars",
    }
  );

  Avatar.findAvatarByUserId = async (userId) => {
    return await Avatar.findOne({ where: { userId } });
  };
  return Avatar;
};
