"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: { model: "users", key: "id" },
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
    await queryInterface.dropTable("posts");
  },
};
