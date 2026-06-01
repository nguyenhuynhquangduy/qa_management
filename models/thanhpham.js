'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thanhpham extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      thanhpham.belongsTo(models.losanxuat, {
        foreignKey: 'losanxuatId',
        as: 'losanxuat'
      });
    }
  }
  thanhpham.init({
    losanxuatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ngayKiem: DataTypes.DATE,
    loCF: DataTypes.STRING,
    KLV: DataTypes.STRING,
    tapDon: DataTypes.STRING,
    tapKhac: DataTypes.STRING,
    tap4Amino: DataTypes.STRING,
    tongTap: DataTypes.STRING,
    doMinLon: DataTypes.STRING,
    doMinNho: DataTypes.STRING,
    soSaiLech: DataTypes.STRING,
    soKiemSoatThayDoi: DataTypes.STRING,
    ghiChu: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'thanhpham',
  });
  return thanhpham;
};