'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('losanxuats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soLo: {
        type: Sequelize.STRING
      },
      thamDinh: {
        type: Sequelize.BOOLEAN
      },
      tenSanPham: {
        type: Sequelize.STRING
      },
      dangBaoChe: {
        type: Sequelize.STRING
      },
      quyCachDongGoi: {
        type: Sequelize.STRING
      },
      coLo: {
        type: Sequelize.STRING
      },
      ghiChu: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      isDelete: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('losanxuats');
  }
};