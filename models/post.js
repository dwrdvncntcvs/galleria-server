"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, ImagePost, Comment }) {
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "cascade",
        hooks: true,
        targetKey: "id",
      });

      this.hasOne(ImagePost, { foreignKey: "postId" });

      this.hasMany(Comment, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        // validate: {
        //   notEmpty: { msg: [403, "\nPost should not be empty."] },
        //   notNull: { msg: [403, "\nPost should not be empty."] },
        // },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
    }
  );
  Post.findPostById = async (id) => {
    return await Post.findOne({ where: { id } });
  };

  Post.findAllPosts = async ({ userId, userData, limit = 0, page }) => {
    const { User, Avatar } = require("../models");

    const paramObj = userId
      ? {
          where: { userId: { [Op.or]: [...getUserId(userData), userId] } },
          limit,
          offset: page,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password", "email", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Avatar,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        }
      : {
          limit,
          offset: page,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password", "email", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Avatar,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        };

    return await Post.findAll(paramObj);
  };

  const getUserId = (userData = []) => {
    return userData.map((user) => user.id);
  };

  return Post;
};
