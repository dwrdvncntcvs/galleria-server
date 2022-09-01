"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        targetKey: "id",
        hooks: true,
        onDelete: "cascade",
      });
    }
  }
  Otp.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Otp",
      tableName: "otps",
    }
  );

  Otp.createOtpToken = async ({ token, userId, transaction }) => {
    return await Otp.create(
      { otp: token, userId, verified: true },
      { transaction }
    );
  };

  Otp.updateExistingOtpToken = async ({
    token,
    userId,
    otpId,
    transaction,
  }) => {
    return await Otp.update(
      { otp: token },
      { where: { userId, id: otpId } },
      { transaction }
    );
  };

  Otp.findOtpTokenByUserId = async (userId) => {
    return await Otp.findOne({ where: { userId } });
  };

  return Otp;
};
