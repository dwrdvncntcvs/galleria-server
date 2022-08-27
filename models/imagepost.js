"use strict";
const { Model } = require("sequelize");
const {
  uploadFileToFS,
  removeFileFromFS,
} = require("../src/services/firebaseService");
module.exports = (sequelize, DataTypes) => {
  class ImagePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      this.belongsTo(Post, {
        foreignKey: { name: "postId", allowNull: false },
        hooks: true,
        onDelete: "cascade",
        targetKey: "id",
      });
    }
  }
  ImagePost.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      postImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // filename: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // path: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // mimetype: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // size: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ImagePost",
      tableName: "imagePosts",
    }
  );

  ImagePost.getPostsImages = async (data) => {
    return data.map(async (post) => {
      const imagePosts = await ImagePost.findAll({
        where: { postId: post.id },
      });
      post["dataValues"]["ImagePost"] = imagePosts;
      return post;
    });
  };

  ImagePost.createAndUploadImage = async ({
    imageData,
    postId,
    transaction,
  }) => {
    const imageUrl = await uploadFileToFS({ file: imageData });

    try {
      return await ImagePost.create(
        { postImageUrl: imageUrl, postId },
        { transaction }
      );
    } catch (err) {
      if (err) {
        await removeFileFromFS({ imageUrl });
        return new Error("Error saving image to database.");
      }
    }
  };
  return ImagePost;
};
