'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('thanhphams', {
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
      ngayKiem: {
        type: Sequelize.DATE
      },
      loCF: {
        type: Sequelize.STRING
      },
      KLV: {
        type: Sequelize.STRING
      },
      tapDon: {
        type: Sequelize.STRING
      },
      tapKhac: {
        type: Sequelize.STRING
      },
      tap4Amino: {
        type: Sequelize.STRING
      },
      tongTap: {
        type: Sequelize.STRING
      },
      doMinLon: {
        type: Sequelize.STRING
      },
      doMinNho: {
        type: Sequelize.STRING
      },
      soSaiLech: {
        type: Sequelize.STRING
      },
      soKiemSoatThayDoi: {
        type: Sequelize.STRING
      },
      ghiChu: {
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
    await queryInterface.dropTable('thanhphams');
  }
};