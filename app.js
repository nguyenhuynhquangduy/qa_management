const express = require('express');
const http = require('http');
const https = require('https'); // Thêm thư viện https
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment-timezone');
const fs = require('fs');
const morgan = require('morgan');

//lấy hàm logger
const { httpLogStream } = require('./utils/logger');
const SECRET = process.env.SECRET;



const MemoryStore = require('memorystore')(session);

moment.tz.setDefault('Asia/Ho_Chi_Minh');
const app = express();
app.use(favicon(path.join(__dirname, 'public', '/images/ico/favicon.ico')));


const rateLimiter = require('./utils/rateLimiter');
// Giới hạn: tối đa 10 request mỗi 3 giây / IP
app.use('/api', rateLimiter({
    windowMs: 5000,
    maxRequests: 10,
}));
app.use(morgan('dev', {
    skip: (req, res) => {
        return /\.(css|js|jpg|jpeg|png|gif|ico|woff|woff2|ttf|eot|svg)$/i.test(req.url);
    }
}));
app.use(morgan('combined', {
    stream: httpLogStream,
    skip: (req, res) => {
        return /\.(css|js|jpg|jpeg|png|gif|ico|woff|woff2|ttf|eot|svg)$/i.test(req.url);
    }
}));
// Cấu hình session
app.use(session({
    secret: SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // Thời gian sống của cookie (12 giờ)
    store: new MemoryStore({
        checkPeriod: 8 * 60 * 60 * 1000 // Thời gian kiểm tra và loại bỏ các phiên đã hết hạn (12 giờ)
    }),
    resave: false, // Không lưu lại phiên nếu không có sự thay đổi
    saveUninitialized: true
})); // session secret 


require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
const initAdminAccount = require('./config/init-admin');


//Truyền user đã đăng nhập vào res.locals
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});
// Models 
const models = require("./models");

// Sử dụng connect-flash
app.use(flash());
models.sequelize.sync().then(function () {
    console.log('Kết nối Database thành công!');
    initAdminAccount();
}).catch(function (err) {
    console.log(err, "Có lỗi trong quá trình kết nối Database!");
});

// Cấu hình thư mục public
const public = path.join(__dirname, 'public');
app.use(express.static(public));



app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.locals.pretty = true;

// xử lý body request có dạng URL-encoded.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // 'true' cần gửi dữ liệu phức tạp, chẳng hạn như mảng, đối tượng lồng nhau, hoặc form có cấu trúc nhiều lớp
/*
Từ Express 4.16 trở lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
👉 Đã tích hợp sẵn body-parser bên trong rồi
Hoạt động gần như giống nhau.
*/
// cấu hình route
const index = require('./routes/router');
const rights = require('./routes/rights');
const user = require('./routes/user');
const danhmuc = require('./routes/danhmuc');


app.use('/', index);
app.use("/rights", rights);
app.use("/users", user);
app.use("/danhmuc", danhmuc);
// session-based flash messages (Middleware để quản lý flash message)
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});
// Middleware để đặt flash messages vào res.locals
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    res.locals.user = req.user || null;  // Gán thông tin người dùng vào res.locals
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Không tìm thấy đường dẫn này, vui lòng quay lại trang chủ để tiếp tục !');
    err.status = 404;
    next(err);
});

// error handler for development environment
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// error handler for production environment
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const port = process.env.PORT || '4000';

const { logger } = require('./utils/logger');

// app.listen(port, () => {
//     logger.info(`Express running on http://localhost:${port}/`);
// });

module.exports = app; // Xuất app để sử dụng trong main.js của Electron