'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class import_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  import_history.init({
    fileName: DataTypes.STRING,
    tongDong: DataTypes.STRING,
    thanhCong: DataTypes.STRING,
    thatBai: DataTypes.STRING,
    nguoiThucHien: DataTypes.STRING,
    thoiGian: DataTypes.DATE,
    logLoi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'import_history',
  });
  return import_history;
};