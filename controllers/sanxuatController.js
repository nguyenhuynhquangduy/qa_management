const db = require("../models/index");
const { Op, where, NUMBER } = require("sequelize");
const moment = require('moment-timezone');
const cleanAndValidateString = require('../controllers/checkString'); // Đổi tên file cho đúng

const getSanXuatMenu = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const contextDist = {
            title: "Quản lý sản xuất - viên cốm",
            errorMessages, successMessages,
        }
        return res.render('./sanxuat/menu_sanxuat', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const getListSanpham = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const search = req.query.search || '';
        const sanphams = await db.losanxuat.findAll({
            where: {
                tenSanPham: { [Op.like]: `%${search}%` }
            },
            include: {
                model: db.hoatchatsanxuat,
                as: 'hoatchats'
            }
        });
        // sanphams.forEach(sanpham => {
        //     sanpham.hoatchats.forEach(hoatchat => {
        //         console.log("hoatchat:", hoatchat);
        //     })
        // })
        const contextDist = {
            title: "Thêm sản phẩm - viên cốm",
            errorMessages, successMessages, sanphams
        }
        return res.render('./sanxuat/danhsachsanpham', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const getAddSanPham = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const contextDist = {
            title: "Danh sách danh muc",
            errorMessages, successMessages,
        }
        return res.render('./sanxuat/add_sanpham', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

const postAddSanPham = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        let { soLo, tenSanPham, dangBaoChe, quyCachDongGoi, ghiChu, tenHoatChat, coLo } = req.body;
        const thamDinh = req.body.thamDinh === 'on' ? true : false;
        const validation = cleanAndValidateString(tenSanPham);
        if (!validation.isValid) {
            await transaction.rollback();
            req.flash('error', validation.error);
            return res.redirect("/sanxuat/add-sanpham");
        }
        tenSanPham = validation.data;
        const sanpham = await db.losanxuat.create({
            soLo,
            tenSanPham,
            dangBaoChe,
            quyCachDongGoi,
            ghiChu,
            thamDinh,
            coLo,
            status: "active"
        }, { transaction });
        const danhSachHoatChat = (Array.isArray(tenHoatChat)
            ? tenHoatChat
            : (tenHoatChat ? [tenHoatChat] : [])
        ).map(item => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
        // .filter(Boolean) để loại bỏ các chuỗi rỗng nếu có
        if (danhSachHoatChat.length > 0) {
            await db.hoatchatsanxuat.bulkCreate(danhSachHoatChat.map(item => ({
                losanxuatId: sanpham.id,
                tenHoatChat: item
            })), { transaction });
        }
        await transaction.commit();
        req.flash('success', "Thêm sản phẩm thành công!");
        return res.redirect("/sanxuat/add-sanpham");
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        next(e);
    }
}
const deleteSanPham = async (req, res, next) => {
    try {
        const id = req.query.id || '';
        const sanpham = await db.losanxuat.findByPk(id);
        if (!sanpham) {
            req.flash('error', "Sản phẩm không tồn tại !");
            return res.redirect(req.get('Referer') || '/sanxuat/sanpham-list');
        }
        if (sanpham.status === "completed") {
            req.flash('error', "Sản phẩm đã hoàn thành không thể xoá !");
            return res.redirect(req.get('Referer') || '/sanxuat/sanpham-list');
        }
        await sanpham.destroy();
        req.flash('success', "Xóa sản phẩm công!");
        return res.redirect("/sanxuat/sanpham-list");
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postUpdateSanPham = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        //lấy sản phẩm từ FE
        let { id, soLo, tenSanPham, dangBaoChe, quyCachDongGoi, ghiChu, tenHoatChat, coLo, status } = req.body;
        const thamDinh = req.body.thamDinh === 'on' ? true : false;
        // kiểm tra sản phẩm có tồn tại không
        const sanpham = await db.losanxuat.findByPk(id, {
            include: [
                {
                    model: db.BTPcom,
                    as: "BTPcom"
                }
            ]
            , transaction
        },
        );
        if (!sanpham) {
            await transaction.rollback();
            req.flash('error', "Sản phẩm không tồn tại hoặc được xóa trước đó!");
            return res.redirect("/sanxuat/sanpham-list");
        }
        // 3. Tiến hành validate tên sản phẩm (Sử dụng hàm cleanAndValidateString baise)
        const validation = cleanAndValidateString(tenSanPham);
        if (!validation.isValid) {
            await transaction.rollback();
            req.flash('error', validation.error);
            return res.redirect("/sanxuat/add-sanpham");
        }
        tenSanPham = validation.data;
        // 4. Cập nhật trong bảng losanxuat (ĐÃ THÊM AWAIT)
        const sanphamUpdate = await sanpham.update({
            soLo,
            tenSanPham,
            dangBaoChe,
            quyCachDongGoi,
            ghiChu,
            thamDinh,
            coLo,
            status,
        }, { transaction });
        // 5. Danh sách hoạt chất mới từ form gửi lên
        const danhSachHoatChatMoi = (Array.isArray(tenHoatChat)
            ? tenHoatChat
            : (tenHoatChat ? [tenHoatChat] : [])
        ).map(item => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
        //6. lấy danh sách hoạt chất hiện tại
        const hoatchatsHienTai = await db.hoatchatsanxuat.findAll({
            where: { losanxuatId: id },
            attributes: ['tenHoatChat'],
            raw: true,
            transaction
        });
        // Chuyển mảng Object từ DB thành mảng các chuỗi đơn thuần để dễ so sánh
        // Ví dụ: [{tenHoatChat: 'A'}, {tenHoatChat: 'B'}] -> ['A', 'B']
        const danhSachHoatChatHienTai = hoatchatsHienTai.map(item => item.tenHoatChat.trim()).filter(Boolean);


        // 7. SO SÁNH: Kiểm tra xem 2 mảng cũ và mới có KHÁC nhau không
        // Sắp xếp (sort) cả 2 mảng để tránh trường hợp đổi thứ tự nhập (ví dụ: ['A', 'B'] so với ['B', 'A'])
        const isChanged = JSON.stringify([...danhSachHoatChatMoi].sort()) !== JSON.stringify([...danhSachHoatChatHienTai].sort());

        // 8. CHỈ HÀNH ĐỘNG KHI CÓ SỰ THAY ĐỔI
        if (isChanged) {
            if (sanpham.BTPcom && sanpham.BTPcom.length > 0) {
                await transaction.rollback();
                req.flash('error', "Sản phẩm đã đến giai đoạn BTP, không thể cập nhật hoạt chất!");
                return res.redirect("/sanxuat/sanpham-list");
            }
            console.log("Phát hiện thay đổi hoạt chất! Tiến hành cập nhật...");

            //  Xóa hết các hoạt chất cũ
            await db.hoatchatsanxuat.destroy({ where: { losanxuatId: id }, transaction });

            if (danhSachHoatChatMoi.length > 0) {
                await db.hoatchatsanxuat.bulkCreate(danhSachHoatChatMoi.map(item => ({
                    tenHoatChat: item,
                    losanxuatId: id
                })), { transaction });
            }
        } else {
            console.log("Hoạt chất giữ nguyên, không cần thao tác với Database.");
        }
        // 9. XÁC NHẬN THÀNH CÔNG (ĐÃ THÊM COMMIT VÀ ĐIỀU HƯỚNG TRẢ VỀ)
        await transaction.commit();
        req.flash('success', "Cập nhật sản phẩm thành công!");
        return res.redirect("/sanxuat/sanpham-list");
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        next(e);
    }
}

const getEditSanPham = async (req, res, next) => {
    try {
        const id = req.query.id || '';
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const sanpham = await db.losanxuat.findByPk(id);
        if (!sanpham) {
            req.flash('error', "Sản phẩm không tồn tại !");
            return res.redirect(req.get('Referer') || '/sanxuat/sanpham-list');
        }
        const hoatchats = await db.hoatchatsanxuat.findAll({ where: { losanxuatId: id } });
        const contextDist = {
            title: "Cập nhật thông tin sản phẩm",
            errorMessages, successMessages, sanpham, hoatchats
        }

        return res.render('./sanxuat/edit_sanpham', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

const getAPIthongTinPhaChe = async (req, res, next) => {
    try {
        const losanxuatId = req.query.id || '';
        const thongtinphache = await db.thongtinphache.findOne({ where: { losanxuatId }, raw: true });
        if (!thongtinphache) return res.json(null);
        return res.json(thongtinphache);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postAPIthongTinPhaChe = async (req, res, next) => {
    try {
        const losanxuatId = req.body.losanxuatId || '';
        const sanpham = await db.losanxuat.findByPk(losanxuatId);
        if (!sanpham) {
            return res.json({ message: "Sản phẩm không tốn tại !" });
        }
        if (sanpham.status === "completed") {
            return res.json({ message: "Sản phẩm đã hoàn thành không thể cập nhật !" });
        }
        await db.thongtinphache.upsert(req.body);

        return res.json({ message: "Cập nhật thòng tin pha chế thành công" });

    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
        next(e);
    }
}
const getAPI_BTPcom = async (req, res, next) => {
    try {
        const losanxuatId = req.query.id || '';
        const btpcom = await db.BTPcom.findOne({ where: { losanxuatId }, raw: true });
        if (!btpcom) return res.json(null);
        const hoatchats = await db.hoatchatsanxuat.findAll({
            where: { losanxuatId },
            attributes: ['id', 'tenHoatChat', 'BTP_dinhLuong'],
            raw: true
        });
        btpcom.hoatchats = hoatchats;
        return res.json(btpcom);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postAPI_BTPcom = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        const losanxuatId = req.body.losanxuatId || '';
        const sanpham = await db.losanxuat.findByPk(losanxuatId, { transaction });
        if (!sanpham) {
            // Gặp lỗi thì hủy transaction trước khi return
            await transaction.rollback();
            return res.json({ message: "Sản phẩm không tốn tại !" });
        }
        if (sanpham.status === "completed") {
            await transaction.rollback();
            return res.json({ message: "Sản phẩm đã hoàn thành không thể cập nhật!" });
        }
        const { BTP_dinhLuong, ...BTPcom } = req.body;
        await db.BTPcom.upsert(BTPcom, { transaction });
        // 2. Kiểm tra và bóc tách object BTP_dinhLuong an toàn
        const dinhLuongInput = BTP_dinhLuong || {};
        // Sử dụng Object.entries để duyệt qua từng cặp ID và Giá trị
        const danhSachDinhLuong = Object.entries(dinhLuongInput).map(([id, value]) => {
            return {
                id: parseInt(id),       // Chuyển key '6', '7' từ chuỗi thành số nguyên (INT)
                value: Number(value) // Chuyển value '97.02', '102.5' từ chuỗi thành số thực (FLOAT)
            };
        });
        // 3. SỬA LỖI: Dùng vòng lặp for...of để chạy được await chính xác từng bước
        for (const item of danhSachDinhLuong) {
            const hoatchat = await db.hoatchatsanxuat.findByPk(item.id, { transaction });

            if (!hoatchat) {
                // Nếu 1 hoạt chất lỗi, hủy toàn bộ quá trình (bao gồm cả lệnh upsert ở trên)
                await transaction.rollback();
                return res.json({ message: `Hoạt chất ID ${item.id} không tồn tại !` });
            }

            hoatchat.BTP_dinhLuong = item.value;
            await hoatchat.save({ transaction });
        }

        // 4. SỬA LỖI: Commit để chính thức lưu mọi thay đổi vào Database
        await transaction.commit();

        return res.json({ message: "Cập nhật thông tin thành công" });
    } catch (e) {
        // 5. SỬA LỖI: Nếu có bất kỳ lỗi hệ thống nào xảy ra, rollback ngay lập tức
        if (transaction) await transaction.rollback();

        console.error("Lỗi cập nhật BTP Com:", e);
        // Tránh dùng res.status().send() chung với next(e) vì dễ gây lỗi lặp response
        return res.status(500).json({ message: "Lỗi hệ thống nội bộ", error: e.message });
    }
}
module.exports = {
    getAPI_BTPcom,
    postAPI_BTPcom,
    postAPIthongTinPhaChe,
    getAPIthongTinPhaChe,
    getEditSanPham,
    postUpdateSanPham,
    deleteSanPham,
    postAddSanPham,
    getListSanpham,
    getSanXuatMenu,
    getAddSanPham
}