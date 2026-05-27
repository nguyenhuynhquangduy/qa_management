const express = require("express");
const router = express.Router();
const rights = require("../controllers/rightController");
const logs = require('../utils/log');


router.get("/rights-group", isLoggedIn, isAdmin, rights.getRightsGroup);
router.post("/rights-group-add", isLoggedIn, isAdmin, logs, rights.postRightsGroup);
router.post("/rights-group-update", isLoggedIn, isAdmin, logs, rights.updateRightsGroup);
router.get("/rights-group-delete", isLoggedIn, isAdmin, rights.deleteRightsGroup);
router.get("/rights-management", isLoggedIn, isAdmin, rights.getRightsManamgement);

router.post("/rights-add", isLoggedIn, isAdmin, rights.postRights);
router.post("/rights-update", isLoggedIn, isAdmin, rights.updateRights);
router.get("/rights-delete", isLoggedIn, isAdmin, rights.deleteRights);
router.get("/rights-active", isLoggedIn, rights.getRightsActive);
router.get("/rights-of-user", isLoggedIn, rights.getRightOfUser);
router.post("/rights-of-user-update", isLoggedIn, rights.updateRightsOfUser);

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