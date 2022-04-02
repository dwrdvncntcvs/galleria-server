"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, ImagePost }) {
      this.belongsTo(User, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "cascade",
        hooks: true,
        targetKey: "id",
      });

      this.hasOne(ImagePost, { foreignKey: "postId" });
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

  return Post;
};
