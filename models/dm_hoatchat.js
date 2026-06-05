'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dm_hoatchat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dm_hoatchat.init({
    tenHoatChat: DataTypes.STRING,
    ghiChu: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'dm_hoatchat',
  });
  return dm_hoatchat;
};