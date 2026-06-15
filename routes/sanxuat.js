const express = require("express");
const router = express.Router();
const sanxuat = require("../controllers/sanxuatController");
const logs = require('../utils/log');
const { isLoggedIn, isAdmin } = require('./authMiddleware');
const excel = require('../controllers/excelController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get("/menu-viencom", isLoggedIn, sanxuat.getSanXuatMenu);
router.get("/sanpham-list", isLoggedIn, sanxuat.getListSanpham);
router.get("/add-sanpham", isLoggedIn, sanxuat.getAddSanPham);
router.post("/add-sanpham", isLoggedIn, logs, sanxuat.postAddSanPham);
router.get("/delete-sanpham", isLoggedIn, sanxuat.deleteSanPham);
router.post("/update-sanpham", isLoggedIn, sanxuat.postUpdateSanPham);

router.get('/edit-sanpham', isLoggedIn, sanxuat.getEditSanPham);
router.get('/api/get-thongtinphache', isLoggedIn, sanxuat.getAPIthongTinPhaChe);
router.post('/api/edit-thongtinphache', isLoggedIn, logs, sanxuat.postAPIthongTinPhaChe);

router.get('/api/get-btpcom', isLoggedIn, sanxuat.getAPI_BTPcom);
router.post('/api/edit-btpcom', isLoggedIn, logs, sanxuat.postAPI_BTPcom);

router.get('/api/get-dapvien', isLoggedIn, sanxuat.getAPIdapVien);
router.post('/api/edit-dapvien', isLoggedIn, logs, sanxuat.postAPIdapVien);

router.get('/api/get-thanhpham', isLoggedIn, sanxuat.getAPIthanhPham);
router.post('/api/edit-thanhpham', isLoggedIn, logs, sanxuat.postAPIthanhPham);

router.get('/get-losanxuat', isLoggedIn, sanxuat.getLoSanXuat);
router.get('/get-excel', isLoggedIn, sanxuat.getExcel);

router.get('/getExportDanhsachsanpham', isLoggedIn, excel.exportExcel_DanhSachSanPham);
// router.get('/getExportImportTemplate', isLoggedIn, excel.exportExcel_ImportTemplate); // New route for template export
router.get('/getImportDanhsachsanpham', isLoggedIn, excel.getImportPage);
router.post('/postImportDanhsachsanpham', isLoggedIn, logs, upload.single('excelFile'), excel.importExcel_DanhSachSanPham);
module.exports = router;