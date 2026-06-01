'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BTPcom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BTPcom.belongsTo(models.losanxuat, {
        foreignKey: 'losanxuatId',
        as: 'losanxuat'
      });
    }
  }
  BTPcom.init({
    losanxuatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    KLV_yeucaudap: DataTypes.STRING,
    KLV_QC: DataTypes.STRING,
    tapDon: DataTypes.STRING,
    tapKhac: DataTypes.STRING,
    tongTap: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BTPcom',
  });
  return BTPcom;
};