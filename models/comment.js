"use strict";
const { Model } = require("sequelize");
const { uploadFileToFS } = require("../src/services/firebaseService");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        hooks: true,
        onDelete: "CASCADE",
        targetKey: "id",
      });

      this.belongsTo(Post, {
        foreignKey: { name: "postId", allowNull: false },
        hooks: true,
        onDelete: "CASCADE",
        targetKey: "id",
      });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postId: {
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
      modelName: "Comment",
      tableName: "comments",
    }
  );

  Comment.createNewComment = async ({ text, postId, userId, transaction }) => {
    return await Comment.create(
      { text, imageUrl: "", postId, userId },
      { transaction }
    );
  };

  Comment.getAllCommentsByPostId = async ({ postId }) => {
    const { User, Profile } = require("../models");

    return await Comment.findAll({
      where: { postId },
      attributes: { exclude: ["userId", "updatedAt"] },
      include: [
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: [
                  "id",
                  "userId",
                  "bio",
                  "contactNumber",
                  "dateOfBirth",
                  "address",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          ],
          attributes: {
            exclude: [
              "password",
              "refreshToken",
              "email",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });
  };

  Comment.createImageComment = async ({
    imageFile,
    postId,
    userId,
    text,
    transaction,
  }) => {
    const imageUrl = await uploadFileToFS({ file: imageFile });

    return await Comment.create(
      { imageUrl, postId, userId, text },
      { transaction }
    );
  };

  Comment.updateComment = async ({ text, commentId, transaction }) => {
    return await Comment.update(
      { text },
      { where: { id: commentId } },
      { transaction }
    );
  };

  Comment.deleteComment = async ({ commentId, transaction }) => {
    return await Comment.destroy({ where: { id: commentId } }, { transaction });
  };

  Comment.getCommentsCount = (posts = []) => {
    return posts.map(async (post) => {
      const commentsCount = await Comment.findAndCountAll({
        where: { postId: post.id },
      });

      post["dataValues"]["commentsCount"] = commentsCount.count;
      return post;
    });
  };

  return Comment;
};
