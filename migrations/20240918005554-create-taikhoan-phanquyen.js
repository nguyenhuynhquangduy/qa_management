'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('taikhoan_phanquyens', {
      MATK: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'taikhoans', // Tên bảng `taikhoan`
          key: 'MATK'          // Khoá chính của bảng `taikhoan`
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phanquyenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phanquyens', // Tên bảng `phanquyen`
          key: 'id'           // Khoá chính của bảng `phanquyen`
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('taikhoan_phanquyens');
  }
};