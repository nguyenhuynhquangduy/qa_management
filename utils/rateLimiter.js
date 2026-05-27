// middleware/rateLimiter.js

const rateLimitMap = new Map();

function rateLimiter(options = {}) {
    const {
        windowMs = 1000,     // thời gian kiểm tra (default: 1000ms = 1s)
        maxRequests = 5,     // tối đa bao nhiêu request trong khoảng thời gian đó
        message = 'Bạn đang thao tác quá nhanh. Vui lòng chậm lại   ', // thông báo trả về
    } = options;

    return (req, res, next) => {
        // Bỏ qua file tĩnh
        const url = req.originalUrl;
        if (url.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|ico)$/)) {
            return next();
        }
        const ip = req.ip;
        const now = Date.now();

        // lấy lịch sử truy cập IP hoặc khởi tạo mới
        let ipData = rateLimitMap.get(ip) || { count: 0, startTime: now };

        // reset lại nếu quá thời gian window
        if (now - ipData.startTime > windowMs) {
            ipData = { count: 1, startTime: now };
        } else {
            ipData.count += 1;
        }

        // lưu lại dữ liệu IP
        rateLimitMap.set(ip, ipData);

        if (ipData.count > maxRequests) {
            return res.status(429).send(message);
        }

        next();
    };
}

module.exports = rateLimiter;
