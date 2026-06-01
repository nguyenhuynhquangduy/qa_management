'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('import_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileName: {
        type: Sequelize.STRING
      },
      tongDong: {
        type: Sequelize.STRING
      },
      thanhCong: {
        type: Sequelize.STRING
      },
      thatBai: {
        type: Sequelize.STRING
      },
      nguoiThucHien: {
        type: Sequelize.STRING
      },
      thoiGian: {
        type: Sequelize.DATE
      },
      logLoi: {
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
    await queryInterface.dropTable('import_histories');
  }
};