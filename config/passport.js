const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require("../models/index");
const passport = require('passport');

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.MATK);
    });

    passport.deserializeUser(async (MATK, done) => {
        try {
            const user = await db.taikhoan.findByPk(MATK, {
                include: [{
                    model: db.phanquyen, // Bao gồm quyền
                    as: 'phanquyens',
                    through: db.taikhoan_phanquyen
                }]
            });
            // Lưu danh sách các quyền vào user
            const userWithPermissions = {
                ...user.toJSON(),
                phanquyens: user.phanquyens.map(q => q.tenquyen) // Lấy tên quyền
            };
            done(null, userWithPermissions);
        } catch (err) {
            done(err);
        }
    });

    passport.use('signin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        try {
            const user = await db.taikhoan.scope('withPassword').findOne({
                where: { username },
            });
            if (!user) {
                return done(null, false, req.flash('error', 'Tài khoản không tồn tại'));
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, req.flash('error', 'Sai mật khẩu.'));
            }
            return done(null, user);
        } catch (e) {
            // ✅ Đúng cách để thông báo lỗi
            return done(e);
        }
    }));
};
