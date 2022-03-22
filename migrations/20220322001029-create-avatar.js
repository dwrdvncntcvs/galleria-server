"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("avatars", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      filename: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      path: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      mimetype: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      size: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
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
    await queryInterface.dropTable("avatars");
  },
};
