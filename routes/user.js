const express = require("express");
const router = express.Router();
const logs = require('../utils/log');
const user = require("../controllers/userController");

router.get("/profile", isLoggedIn, user.getUserProfile);
router.post("/change-password", isLoggedIn, logs, user.changePassword);
module.exports = router;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/');
}

function isAdmin(req, res, next) {

    if (req.isAuthenticated()) {
        if (req.user.admin == 1) {
            return next();
        }
        else {
            return res.redirect('/error-admin.html');
        }
    }

    return res.redirect('/');
}

function kiemtraQuyen(requiredPermission) {
    return (req, res, next) => {
        if (req.user && req.user.phanquyens.includes(requiredPermission)) {
            return next();
        } else {
            return res.status(403).send('Bạn không có quyền truy cập.');
        }
    };
}
module.exports = router;