'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hoatchatsanxuats', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tenHoatChat: {
        type: Sequelize.STRING
      },
      BTP_dinhLuong: {
        type: Sequelize.DECIMAL(5, 2)
      },
      dapVien_dinhLuong: {
        type: Sequelize.DECIMAL(5, 2)
      },
      dapVien_hoatan1: {
        type: Sequelize.STRING
      },
      dapVien_hoatan2: {
        type: Sequelize.STRING
      },
      thanhPham_dinhLuong: {
        type: Sequelize.DECIMAL(5, 2)
      },
      thanhPham_doRa: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien1: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien2: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien3: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien4: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien5: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan1_vien6: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien1: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien2: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien3: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien4: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien5: {
        type: Sequelize.STRING
      },
      thanhPham_hoatan2_vien6: {
        type: Sequelize.STRING
      },
      thanhPham_doAm: {
        type: Sequelize.STRING
      },
      DDDVL_TB: {
        type: Sequelize.STRING
      },
      DDDVL_AV: {
        type: Sequelize.STRING
      },
      DDDVL_Vien1: {
        type: Sequelize.STRING
      },
      DDDVL_Vien2: {
        type: Sequelize.STRING
      },
      DDDVL_Vien3: {
        type: Sequelize.STRING
      },
      DDDVL_Vien4: {
        type: Sequelize.STRING
      },
      DDDVL_Vien5: {
        type: Sequelize.STRING
      },
      DDDVL_Vien6: {
        type: Sequelize.STRING
      },
      DDDVL_Vien7: {
        type: Sequelize.STRING
      },
      DDDVL_Vien8: {
        type: Sequelize.STRING
      },
      DDDVL_Vien9: {
        type: Sequelize.STRING
      },
      DDDVL_Vien10: {
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
    await queryInterface.dropTable('hoatchatsanxuats');
  }
};