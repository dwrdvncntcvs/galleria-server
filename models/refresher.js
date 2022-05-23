"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Refresher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        hooks: true,
        targetKey: "id",
      });
    }
  }
  Refresher.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: { type: DataTypes.UUID, allowNull: false },
      refreshToken: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Refresher",
      tableName: "refreshers",
    }
  );

  Refresher.findRefreshTokenByUserId = async (id) => {
    return await Refresher.findOne({ where: { userId: id } });
  };

  return Refresher;
};
