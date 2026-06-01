'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thongtinphache extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      thongtinphache.belongsTo(models.losanxuat, {
        foreignKey: 'losanxuatId',
        as: 'losanxuat'
      });
    }
  }
  thongtinphache.init({
    losanxuatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ngayPhache: DataTypes.DATE,
    heSoBu: DataTypes.STRING,
    say1: DataTypes.STRING,
    THT1: DataTypes.STRING,
    vien1: DataTypes.STRING,
    say2: DataTypes.STRING,
    THT2: DataTypes.STRING,
    vien2: DataTypes.STRING,
    doCung: DataTypes.STRING,
    doRa: DataTypes.STRING,
    doMayMon: DataTypes.STRING,
    ngayDongGoiCap1: DataTypes.DATE,
    khoiLuongCom: DataTypes.STRING,
    khoiLuongGiaoNop: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'thongtinphache',
  });
  return thongtinphache;
};