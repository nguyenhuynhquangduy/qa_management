'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hoatchatsanxuat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      hoatchatsanxuat.belongsTo(models.losanxuat, {
        foreignKey: 'losanxuatId',
        as: 'losanxuat'
      });
    }
  }
  hoatchatsanxuat.init({
    losanxuatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenHoatChat: DataTypes.STRING,
    BTP_dinhLuong: DataTypes.DECIMAL(5, 2),
    dapVien_dinhLuong: DataTypes.DECIMAL(5, 2),
    dapVien_hoatan1: DataTypes.STRING,
    dapVien_hoatan2: DataTypes.STRING,
    thanhPham_dinhLuong: DataTypes.DECIMAL(5, 2),
    thanhPham_doRa: DataTypes.STRING,
    thanhPham_hoatan1_vien1: DataTypes.STRING,
    thanhPham_hoatan1_vien2: DataTypes.STRING,
    thanhPham_hoatan1_vien3: DataTypes.STRING,
    thanhPham_hoatan1_vien4: DataTypes.STRING,
    thanhPham_hoatan1_vien5: DataTypes.STRING,
    thanhPham_hoatan1_vien6: DataTypes.STRING,
    thanhPham_hoatan2_vien1: DataTypes.STRING,
    thanhPham_hoatan2_vien2: DataTypes.STRING,
    thanhPham_hoatan2_vien3: DataTypes.STRING,
    thanhPham_hoatan2_vien4: DataTypes.STRING,
    thanhPham_hoatan2_vien5: DataTypes.STRING,
    thanhPham_hoatan2_vien6: DataTypes.STRING,
    thanhPham_doAm: DataTypes.STRING,
    DDDVL_TB: DataTypes.STRING,
    DDDVL_AV: DataTypes.STRING,
    DDDVL_Vien1: DataTypes.STRING,
    DDDVL_Vien2: DataTypes.STRING,
    DDDVL_Vien3: DataTypes.STRING,
    DDDVL_Vien4: DataTypes.STRING,
    DDDVL_Vien5: DataTypes.STRING,
    DDDVL_Vien6: DataTypes.STRING,
    DDDVL_Vien7: DataTypes.STRING,
    DDDVL_Vien8: DataTypes.STRING,
    DDDVL_Vien9: DataTypes.STRING,
    DDDVL_Vien10: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'hoatchatsanxuat',
  });
  return hoatchatsanxuat;
};