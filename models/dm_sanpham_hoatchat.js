'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dm_sanpham_hoatchat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dm_sanpham_hoatchat.belongsTo(models.dm_sanpham, {
        foreignKey: 'idDmSanPham',
        as: 'dm_sanpham'
      });
    }
  }
  dm_sanpham_hoatchat.init({
    idDmSanPham: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tenHoatChat: DataTypes.STRING,
    ghiChu: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dm_sanpham_hoatchat',
  });
  return dm_sanpham_hoatchat;
};