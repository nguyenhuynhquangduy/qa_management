'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class losanxuat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      losanxuat.hasMany(models.hoatchatsanxuat, {
        foreignKey: 'losanxuatId',
        as: 'hoatchat'
      });
      losanxuat.hasOne(models.thongtinphache, {
        foreignKey: 'losanxuatId',
        as: 'phache'

      });
      losanxuat.hasOne(models.BTPcom, {
        foreignKey: 'losanxuatId',
        as: 'BTPcom'
      });
      losanxuat.hasOne(models.dapvien, {
        foreignKey: 'losanxuatId',
        as: 'dapvien'
      });
      losanxuat.hasOne(models.thanhpham, {
        foreignKey: 'losanxuatId',
        as: 'thanhpham'
      });
    }
  }
  losanxuat.init({
    soLo: DataTypes.STRING,
    tenSanPham: DataTypes.STRING,
    dangBaoChe: DataTypes.STRING,
    quyCachDongGoi: DataTypes.STRING,
    coLoVien: DataTypes.INTEGER,
    coLoVi: DataTypes.INTEGER,
    ghiChu: DataTypes.STRING,
    status: DataTypes.STRING,
    isDelete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'losanxuat',
  });
  return losanxuat;
};