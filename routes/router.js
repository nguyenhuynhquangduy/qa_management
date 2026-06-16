const express = require("express");
const router = express.Router();
const home = require("../controllers/homeController");
const logs = require('../utils/log');
const { isLoggedIn, isAdmin } = require('./authMiddleware');

router.get("/", home.getIndex);
router.get("/menu", home.getMenu);
router.get("/admin", isLoggedIn, isAdmin, home.getAdmin);
router.post("/signin", home.signin, logs);
router.get("/signout", isLoggedIn, home.signout);
router.get("/admin/add-user", home.getAddUser);
router.post("/admin/add-user", isLoggedIn, isAdmin, logs, home.postAddUser);
router.get("/admin/user-list", isLoggedIn, isAdmin, home.getUserList);
router.post("/admin/update-user", isLoggedIn, isAdmin, home.updateUser);

router.get("/admin/logs", isLoggedIn, isAdmin, home.viewLogs);
router.get("/admin/delete-logs", isLoggedIn, isAdmin, home.deleteLogs);

module.exports = router;