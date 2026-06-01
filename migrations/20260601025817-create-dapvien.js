'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dapviens', {
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
      KLV_yeucau: {
        type: Sequelize.STRING
      },
      KLV_PKN: {
        type: Sequelize.STRING
      },
      dongDeuDonViLieu: {
        type: Sequelize.STRING
      },
      ra: {
        type: Sequelize.STRING
      },
      tapDon: {
        type: Sequelize.STRING
      },
      tapKhac: {
        type: Sequelize.STRING
      },
      tongTap: {
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
    await queryInterface.dropTable('dapviens');
  }
};