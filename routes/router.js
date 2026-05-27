const express = require("express");
const router = express.Router();
const home = require("../controllers/homeController");
const logs = require('../utils/log');

router.get("/", home.getIndex);
router.get("/menu", home.getMenu);
router.get("/admin", isLoggedIn, isAdmin, home.getAdmin);
router.post("/signin", home.signin, logs);
router.get("/signout", isLoggedIn, home.signout);
router.get("/admin/add-user", home.getAddUser);
router.post("/admin/add-user", isLoggedIn, isAdmin, logs, home.postAddUser);
router.get("/admin/user-list", isLoggedIn, isAdmin, home.getUserList);
router.post("/admin/update-user", isLoggedIn, isAdmin, home.updateUser);

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