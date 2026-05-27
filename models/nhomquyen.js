'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class nhomquyen extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            nhomquyen.hasMany(models.phanquyen, {
                foreignKey: 'MANQ',
                as: 'phanquyen',
            });
        }
    }
    nhomquyen.init({
        MANQ: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TenNQ: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'nhomquyen',
    });
    return nhomquyen;
};