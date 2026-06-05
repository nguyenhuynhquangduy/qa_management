const express = require("express");
const router = express.Router();
const danhmuc = require("../controllers/danhmucController");
const logs = require('../utils/log');
const { isLoggedIn } = require('./authMiddleware');

router.get("/danhmuc-menu", isLoggedIn, danhmuc.getDanhMuc);

router.get("/sanpham", isLoggedIn, danhmuc.getSanPham);
router.get("/add-sanpham", isLoggedIn, danhmuc.getAddSanPham);
router.post("/add-sanpham", isLoggedIn, logs, danhmuc.postAddSanPham);
router.post("/update-sanpham", isLoggedIn, danhmuc.postUpdateSanPham);
router.get("/delete-sanpham", isLoggedIn, danhmuc.deleteSanPham);

router.get("/hoatchat", isLoggedIn, danhmuc.getHoatChat);
router.get("/add-hoatchat", isLoggedIn, danhmuc.addHoatChat);
router.post("/add-hoatchat", isLoggedIn, logs, danhmuc.postAddHoatChat);
router.post("/update-hoatchat", isLoggedIn, logs, danhmuc.updateHoatChat);
router.get("/delete-hoatchat", isLoggedIn, danhmuc.deleteHoatChat);
router.get("/api/ten-hoatchat", isLoggedIn, danhmuc.getTenHoatChatAPI);


module.exports = router;