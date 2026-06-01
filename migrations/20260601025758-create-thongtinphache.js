'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('thongtinphaches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      losanxuatId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'losanxuats',
          key: 'id'
        },
        allowNull: false,
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ngayPhache: {
        type: Sequelize.DATE
      },
      heSoBu: {
        type: Sequelize.STRING
      },
      say1: {
        type: Sequelize.STRING
      },
      THT1: {
        type: Sequelize.STRING
      },
      vien1: {
        type: Sequelize.STRING
      },
      say2: {
        type: Sequelize.STRING
      },
      THT2: {
        type: Sequelize.STRING
      },
      vien2: {
        type: Sequelize.STRING
      },
      doCung: {
        type: Sequelize.STRING
      },
      doRa: {
        type: Sequelize.STRING
      },
      doMayMon: {
        type: Sequelize.STRING
      },
      ngayDongGoiCap1: {
        type: Sequelize.DATE
      },
      khoiLuongCom: {
        type: Sequelize.STRING
      },
      khoiLuongGiaoNop: {
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
    await queryInterface.dropTable('thongtinphaches');
  }
};