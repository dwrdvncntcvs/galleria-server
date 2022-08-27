"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("imagePosts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      postImageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "posts",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("imagePosts");
  },
};
