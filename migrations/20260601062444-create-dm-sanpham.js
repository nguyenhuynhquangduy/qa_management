'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dm_sanphams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tenSanPham: {
        type: Sequelize.STRING
      },
      soDangKy: {
        type: Sequelize.STRING
      },
      dangBaoChe: {
        type: Sequelize.STRING
      },
      quyCachDongGoi: {
        type: Sequelize.STRING
      },
      ghiChu: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('dm_sanphams');
  }
};