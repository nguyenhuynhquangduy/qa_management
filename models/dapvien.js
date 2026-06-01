'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dapvien extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dapvien.belongsTo(models.losanxuat, {
        foreignKey: 'losanxuatId',
        as: 'losanxuat'
      });
    }
  }
  dapvien.init({
    losanxuatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    KLV_yeucau: DataTypes.STRING,
    KLV_PKN: DataTypes.STRING,
    dongDeuDonViLieu: DataTypes.STRING,
    ra: DataTypes.STRING,
    tapDon: DataTypes.STRING,
    tapKhac: DataTypes.STRING,
    tongTap: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dapvien',
  });
  return dapvien;
};