const express = require("express");
const router = express.Router();
const logs = require('../utils/log');
const user = require("../controllers/userController");
const { isLoggedIn } = require('./authMiddleware');

router.get("/profile", isLoggedIn, user.getUserProfile);
router.post("/change-password", isLoggedIn, logs, user.changePassword);

module.exports = router;