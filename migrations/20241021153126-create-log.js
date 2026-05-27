'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MATK: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'taikhoans', // name of Target model
          key: 'MATK', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      action: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.DATE
      },
      additionalInfo: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs');
  }
};