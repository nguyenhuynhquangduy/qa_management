'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class taikhoan_phanquyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      taikhoan_phanquyen.belongsTo(models.taikhoan, { foreignKey: 'MATK' });
      taikhoan_phanquyen.belongsTo(models.phanquyen, { foreignKey: 'phanquyenId' });
    }
  }
  taikhoan_phanquyen.init({
    MATK: DataTypes.INTEGER,
    phanquyenId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'taikhoan_phanquyen',
  });
  return taikhoan_phanquyen;
};