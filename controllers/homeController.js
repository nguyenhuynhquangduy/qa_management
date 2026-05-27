const express = require("express");
// require('dotenv').config();
const db = require("../models/index");
const passport = require('passport');
const moment = require('moment');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const salt = Number(process.env.SALT) || 10;
let countIndex = 0;
let getIndex = async (req, res, next) => {
    try {
        countIndex++;
        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        return res.render('index', {
            title: 'Trang Chủ ',
            customer: req.user,
            errorMessages, successMessages, countIndex
        });

    } catch (e) {
        console.log(e);
        next(e);
    }
};
let getAdmin = async (req, res, next) => {
    try {

        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        const contextDist = {
            errorMessages, successMessages,
            title: "Quản lý hệ thống",
        };
        return res.render('./admin/adminitrator', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
};
const getMenu = async (req, res, next) => {
    try {
        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        const contextDist = {
            errorMessages, successMessages,
            title: "Menu",
        };
        return res.render('./menu', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const signin = (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, " đăng nhập !");

    passport.authenticate('signin', (err, user) => {

        if (err) {
            req.flash('signinError', ' Lỗi đăng nhập');
            console.log('Lỗi đăng nhập', err);
            return next(err);
        }
        if (!user) {
            // req.flash('error', ' Lỗi đăng nhập');
            console.log('Lỗi đăng nhập ko user')
            return res.redirect('/');
        }

        req.logIn(user, (err) => {

            if (err) {
                console.log('Lỗi đăng nhập login', err)
                return next(err);
            }
            // Kiểm tra quyền và chuyển hướng
            if (user && user.admin == 1) {
                console.log('Đăng nhập thành công');
                console.log("req.body:", req.body);
                if (req.body.remember) {

                    // 7 ngày
                    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
                } else {
                    // hết khi đóng browser
                    req.session.cookie.expires = false;
                }

                return res.redirect('/admin');
            } else if (user && user.admin == 0) {
                console.log("Đăng nhập thành công");
                return res.redirect('/menu');
            }
        });
    })(req, res, next);
};
let signout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

const getAddUser = async (req, res, next) => {
    try {
        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        const contextDist = {
            errorMessages, successMessages,
            title: "Thêm tài khoản",
            customer: req.user
        };
        return res.render('./admin/addUser', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const getUserList = async (req, res, next) => {
    try {
        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        const search = req.query.search || '';
        const users = await db.taikhoan.findAll({
            where: {
                username: {
                    [Op.ne]: 'root' // Op.ne = not equal,
                    , [Op.like]: `%${search}%`
                }
            },
            attributes: { exclude: ['password'] }
        })
        const contextDist = {
            errorMessages, successMessages, users,
            title: "Danh sách tài khoản",
        };
        return res.render('./admin/userList', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postAddUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, password, email, fullname, phone, address, status } = req.body;
        const admin = req.body.admin === '1' ? 1 : 0;

        const checkUsername = await db.taikhoan.findOne({ where: { username } });

        if (checkUsername) {
            req.flash('error', 'Username đã tồn tại, vui lòng chọn username khác!');
            return res.redirect(req.get('referer') || "/");
        }
        const hashPassword = await bcrypt.hash(password, salt);

        const taikhoan = await db.taikhoan.create({
            username, password: hashPassword, admin, email, fullname, phone, address, status
        });
        console.log(taikhoan);
        req.flash("success", "Thêm tài khoản thành công !");
        return res.redirect('/admin/add-user');

    } catch (e) {
        console.log(e);
        next(e);
    }
}
const updateUser = async (req, res, next) => {
    try {

        const { MATK, password, admin, ...data } = req.body;
        console.log("red body:", req.body);
        const taikhoan = await db.taikhoan.findByPk(MATK);

        if (!taikhoan) {
            req.flash('error', 'Tài khoản không tồn tại');
            return res.redirect(req.get('Referer') || '/');
        }
        const checkTentaikhoan = await db.taikhoan.findOne({
            where: {
                username: data.username,
                MATK: { [db.Sequelize.Op.ne]: MATK } // khác MATK hiện tại
            }
        })
        if (checkTentaikhoan) {
            req.flash('error', "Tên tài khoản đã tồn tại, vui lòng chọn tên tài khoản khác !");
            return res.redirect(req.get('Referer') || '/');
        }
        if (password && password.trim() !== '') {
            // const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(password, salt);
        }
        if (!admin) {
            data.admin = 0;
        } else {
            data.admin = 1;
        }
        await taikhoan.update(data);
        req.flash('success', 'Cập nhật tài khoản thành công');
        return res.redirect(req.get('Referer') || '/admin/user-list');
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = {
    updateUser,
    getUserList,
    postAddUser,
    getUserList,
    getAddUser,
    getMenu,
    getIndex,
    getAdmin,
    signin,
    signout
};