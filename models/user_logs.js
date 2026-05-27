'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_logs.belongsTo(models.taikhoan, { foreignKey: 'MATK', as: 'taikhoan' });
    }
  }
  user_logs.init({
    MATK: DataTypes.INTEGER,
    action: DataTypes.STRING,
    logs: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_logs',
  });
  return user_logs;
};