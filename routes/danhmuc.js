const express = require("express");
const router = express.Router();
const danhmuc = require("../controllers/danhmucController");
const logs = require('../utils/log');
const { isLoggedIn } = require('./authMiddleware');

router.get("/danhmuc-menu", isLoggedIn, danhmuc.getDanhMuc);
router.get("/add-sanpham", isLoggedIn, danhmuc.getAddSanPham);
router.post("/add-sanpham", isLoggedIn, logs, danhmuc.postAddSanPham);
module.exports = router;