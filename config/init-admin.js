// initAdmin.js
const bcrypt = require('bcrypt');
const db = require("../models/index");
const envpassword = process.env.PASS_ROOT || 'development';
async function initAdminAccount() {
    try {
        const root = await db.taikhoan.findOne({ where: { admin: true } });

        if (!root) {
            const hash = await bcrypt.hash(envpassword, 10);

            await db.taikhoan.create({
                MATK: 1,
                username: 'root',
                password: hash,
                fullname: 'Quản trị viên',
                admin: 1,
                email: 'votinhkhuc@gmail.com',
            });

            console.log('✅ Tạo tài khoản admin mặc định: username=root, password= envpassword');
        }
    } catch (err) {
        console.error('⚠️ Lỗi khi kiểm tra/tạo admin:', err);
    }
}

module.exports = initAdminAccount;
