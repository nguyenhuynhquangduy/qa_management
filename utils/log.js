const db = require("../models/index");

const logAction = async (req, res, next) => {
    try {
        const MATK = req.user ? req.user.MATK : null;
        const action = req.method + ' ' + req.originalUrl;
        let additionalInfo = {
            body: req.body,
            params: req.params,
            query: req.query
        };

        // Chuyển đổi additionalInfo thành chuỗi JSON
        additionalInfo = JSON.stringify(additionalInfo);

        // Lưu log vào cơ sở dữ liệu
        let timestamp = new Date();
        await db.log.create({
            MATK,
            action,
            timestamp,
            additionalInfo
        });

        next(); // Tiếp tục xử lý tiếp theo
    } catch (err) {
        console.error('Error logging action:', err);
        next(err); // Gửi lỗi nếu xảy ra
    }
};

module.exports = logAction;
