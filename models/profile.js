"use strict";
const { Model } = require("sequelize");
const { removeFileFromFS } = require("../src/services/firebaseService");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
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
  Profile.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
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
      modelName: "Profile",
      tableName: "profiles",
    }
  );

  Profile.createDefaultProfile = async ({ userId, transaction }) => {
    console.log("Creating profile...");
    return await Profile.create(
      {
        userId,
        bio: "",
        profileImage: "",
        contactNumber: "",
        dateOfBirth: null,
        address: "",
      },
      { transaction }
    );
  };

  Profile.checkIfUserProfileImageExists = async (id) => {
    const profileData = await Profile.findOne({ where: { userId: id } });

    return profileData.dataValues.profileImage.length > 0;
  };

  Profile.updateProfileImage = async (
    { profileImage, userId },
    transaction
  ) => {
    return await Profile.update(
      { profileImage },
      { where: { userId } },
      { transaction }
    );
  };

  Profile.removeProfileImage = async ({ userId, transaction }) => {
    const { profileImage } = await Profile.findOne({ where: { userId } });

    await removeFileFromFS({ imageUrl: profileImage });

    return await Profile.update(
      { profileImage: "" },
      { where: { userId } },
      { transaction }
    );
  };

  return Profile;
};
