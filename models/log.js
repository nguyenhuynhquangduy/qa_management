'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      log.belongsTo(models.taikhoan, {
        foreignKey: 'MATK',
        as: 'taikhoan',
      });
    }
  }
  log.init({
    MATK: DataTypes.INTEGER,
    action: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    additionalInfo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'log',
  });
  return log;
};