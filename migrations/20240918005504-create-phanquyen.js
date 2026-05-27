'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('phanquyens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            MANQ: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'nhomquyens', // name of Target model
                    key: 'MANQ', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            tenquyen: {
                type: Sequelize.STRING
            },
            description: {
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
        await queryInterface.dropTable('phanquyens');
    }
};