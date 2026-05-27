const db = require("../models/index");
// require('dotenv').config();
// const moment = require('moment');
const { Op, where } = require("sequelize");
const bcrypt = require('bcrypt');
const salt = Number(process.env.SALT);
const crypto = require('crypto');
const { raw } = require("body-parser");
const { create } = require("domain");
const moment = require('moment-timezone');


const getUserProfile = async (req, res, next) => {
    try {
        let errorMessages = req.flash('error');
        let successMessages = req.flash('success');
        const contextDist = {
            errorMessages, successMessages,
            title: "Thông tin tài khoản",
            customer: req.user
        };
        return res.render('./user/profile', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const changePassword = async (req, res, next) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        // req.user không chứa mật khẩu, cần truy vấn lại DB để lấy
        const taikhoan = await db.taikhoan.scope('withPassword').findByPk(req.user.MATK);

        if (!taikhoan) {
            req.flash('error', 'Lỗi! Tài khoản không tồn tại.');
            return res.redirect('/users/profile');
        }
        console.log("salt:", salt);
        const checkPassword = await bcrypt.compare(password, taikhoan.password);
        if (!checkPassword) {
            req.flash('error', 'Error ! Mật khẩu cũ không đúng');
            return res.redirect('/users/profile');
        }
        if (newPassword !== confirmPassword) {
            req.flash('error', "Error ! Mật khẩu mới không khớp.");
            return res.redirect('/users/profile');
        }
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await taikhoan.update({
            password: hashPassword
        });
        req.flash('success', 'Thay đổi mật khẩu  thành công !');
        return res.redirect('/users/profile');
    } catch (error) {
        console.log(error);
        next(error);
    }
}
//AES-256 thuật toán mã hóa = rất mạnh, chuẩn công nghiệp
const algorithm = 'aes-256-cbc';
//Key (chìa khóa)
const key = crypto.createHash('sha256').update(process.env.SECRET).digest();
//số ngẫu nhiên cho IV (Initialization Vector) để tăng cường bảo mật, tránh việc mã hóa giống nhau cho cùng một nội dung
// const iv = crypto.randomBytes(16);
function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}
function decrypt(data) {
    const [ivHex, encrypted] = data.split(':');

    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
const setPasswordMail = async (req, res, next) => {
    try {
        const { MATK, email, passwordMail } = req.body;
        const taikhoan = await db.taikhoan.findByPk(MATK);
        if (!taikhoan) {
            req.flash('error', 'Lỗi! Tài khoản không tồn tại.');
            return res.redirect('/users/profile');
        }
        const encryptedPassword = encrypt(passwordMail);
        await taikhoan.update({
            passwordEmail: encryptedPassword,
            email: email
        });
        req.flash("success", "Cập nhật mật khẩu thành công!");
        return res.redirect('/users/profile');

    }
    catch (e) {
        console.log(e);
        next(e);
    }
}
const getLogsUser = async (req, res, next) => {
    try {
        const MATK = req.user.MATK;
        const logsData = await db.user_logs.findAll({
            where: { MATK },
            order: [['createdAt', 'DESC']],
            limit: 100,
            raw: true
        });
        const logs = logsData.map(log => ({
            ...log,
            createdAt: moment.tz(log.createdAt, 'Asia/Ho_Chi_Minh')
                .format('HH:mm:ss DD/MM/YYYY')
        }));
        const contextDist = {
            title: "Logs hoạt động",
            logs
        }
        return res.render('./user/logsUser', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
module.exports = {
    getLogsUser,
    decrypt,
    setPasswordMail,
    changePassword,
    getUserProfile,
};