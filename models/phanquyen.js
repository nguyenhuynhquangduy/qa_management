'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class phanquyen extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            phanquyen.belongsToMany(models.taikhoan, {
                through://through là một tùy chọn dùng để xác định bảng trung gian trong mối quan hệ N-N (nhiều-nhiều) giữa hai bảng. 
                    models.taikhoan_phanquyen,
                foreignKey: 'phanquyenId', // Khoá ngoại từ bảng `taikhoan_phanquyen`
                otherKey: 'MATK' // Khoá ngoại từ bảng `taikhoan_phanquyen`
            });
            phanquyen.belongsTo(models.nhomquyen, {
                foreignKey: 'MANQ',
                as: 'nhomquyen',
            });


        }
    }
    phanquyen.init({
        tenquyen: DataTypes.STRING,
        MANQ: DataTypes.INTEGER,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'phanquyen',
    }, {
        indexes: [
            {
                unique: true,
                fields: ['MANQ', 'tenquyen']
            }
        ]
    });
    return phanquyen;
};