'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dm_sanpham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dm_sanpham.hasMany(models.dm_sanpham_hoatchat, {
        foreignKey: 'idDmSanPham',
        as: 'hoatchats'
      });
    }
  }
  dm_sanpham.init({
    tenSanPham: DataTypes.STRING,
    soDangKy: DataTypes.STRING,
    dangBaoChe: DataTypes.STRING,
    quyCachDongGoi: DataTypes.STRING,
    ghiChu: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'dm_sanpham',
  });
  return dm_sanpham;
};