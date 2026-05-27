'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class taikhoan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here    
            taikhoan.hasMany(models.log, {
                foreignKey: 'MATK',
                as: 'log'
            });
            taikhoan.belongsToMany(models.phanquyen, {
                through: models.taikhoan_phanquyen,
                foreignKey: 'MATK', // Khoá ngoại từ bảng `taikhoan_phanquyen`
                otherKey: 'phanquyenId', // Khoá ngoại từ bảng `taikhoan_phanquyen`
                as: 'phanquyens' // Alias của quan hệ

            });//through là một tùy chọn dùng để xác định bảng trung gian trong mối quan hệ N-N (nhiều-nhiều) giữa hai bảng. 

        }
    }
    taikhoan.init({
        MATK: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Thêm dòng này ở đây
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                notWhitespace(value) {
                    if (!value || !value.trim()) {
                        throw new Error('Username không được chỉ chứa khoảng trắng');
                    }
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notWhitespace(value) {
                    if (!value || !value.trim()) {
                        throw new Error('Password không được chỉ chứa khoảng trắng');
                    }
                }
            }
        },
        email: DataTypes.STRING,
        passwordEmail: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        fullname: DataTypes.STRING,
        avatar: DataTypes.STRING,
        status: {
            type: DataTypes.STRING(30),
            defaultValue: "active"
        }
        ,
        admin: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'taikhoan',
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    });
    return taikhoan;
};