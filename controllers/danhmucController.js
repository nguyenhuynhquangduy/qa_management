const db = require("../models/index");
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');
const cleanAndValidateString = require('../controllers/checkString'); // Đổi tên file cho đúng
const getDanhMuc = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const contextDist = {
            title: "Danh sách danh muc",
            errorMessages, successMessages,
        }
        return res.render('./danhmuc/menu_danhmuc', contextDist);
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
        return res.render('./danhmuc/add_sanpham', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postAddSanPham = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        // console.log("body:", req.body);
        let { tenSanPham, dangBaoChe, quyCachDongGoi, soDangKy, ghiChu, status, tenHoatChat } = req.body;
        const validation = cleanAndValidateString(tenSanPham);

        // Nếu phát hiện lỗi (ký tự cấm, rỗng...), ném thông báo lỗi ngay
        if (!validation.isValid) {
            await transaction.rollback(); // <--- BẮT BUỘC PHẢI THÊM DÒNG NÀY
            req.flash('error', validation.error);
            return res.redirect("/danhmuc/add-sanpham");
        }
        console.log(tenHoatChat);
        // Nếu hợp lệ, gán lại chuỗi đã sạch (đã trim) vào biến để lưu DB
        tenSanPham = validation.data;
        const sanpham = await db.dm_sanpham.create({
            tenSanPham,
            dangBaoChe,
            quyCachDongGoi,
            soDangKy,
            ghiChu,
            status
        }, { transaction });
        // Đảm bảo tenHoatChat luôn luôn là mảng, kể cả khi client chỉ gửi lên 1 chuỗi hoặc rỗng
        const danhSachHoatChat = Array.isArray(tenHoatChat)
            ? tenHoatChat
            : (tenHoatChat ? [tenHoatChat] : []);

        if (danhSachHoatChat.length > 0) {
            const hoatChatData = danhSachHoatChat.map(item => ({
                idDmSanPham: sanpham.id,
                tenHoatChat: typeof item === 'string' ? item.trim() : item
            }));

            await db.dm_sanpham_hoatchat.bulkCreate(hoatChatData, { transaction });
        }
        /*cách khác
        // 1. Kiểm tra xem dữ liệu tenHoatChat gửi lên có phải là mảng không và có phần tử không
            if (Array.isArray(tenHoatChat) && tenHoatChat.length > 0) {
                
                // 2. Map mảng chuỗi thành mảng các Object phù hợp cấu trúc Database
                // Đừng quên thêm .trim() để làm sạch dữ liệu luôn nhé!
                const hoatChatData = tenHoatChat.map(item => ({
                    idDmSanPham: sanpham.id,
                    tenHoatChat: typeof item === 'string' ? item.trim() : item
                }));

                // 3. Sử dụng bulkCreate để chèn hàng loạt vào DB trong cùng 1 transaction
                await db.dm_sanpham_hoatchat.bulkCreate(hoatChatData, { transaction });
            }
        */
        await transaction.commit();
        req.flash('success', "Them san pham thanh cong!");
        return res.redirect('/danhmuc/add-sanpham');
    } catch (e) {
        await transaction.rollback();
        console.log(e);
        next(e);
    }
}

const getHoatChat = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const search = req.query.search || '';
        const hoatchats = await db.dm_hoatchat.findAll({ where: { tenHoatChat: { [Op.like]: `%${search}%` } } });

        const contextDist = {
            title: "Danh sách hoạt chất",
            errorMessages, successMessages,
            hoatchats
        }
        return res.render('./danhmuc/danhmuchoatchat', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const addHoatChat = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const contextDist = {
            title: "Thêm hoạt chất",
            errorMessages, successMessages,
        }
        return res.render('./danhmuc/add_hoatchat', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postAddHoatChat = async (req, res, next) => {
    try {
        let { tenHoatChat, ghiChu, status } = req.body;

        // Loại bỏ khoảng trắng đầu cuối và các ký tự đặc biệt ; : * - +
        // tenHoatChat = tenHoatChat ? tenHoatChat.trim().replace(/[;:*\-+]/g, '') : '';
        // Xử lý và kiểm tra tên hoạt chất
        const validation = cleanAndValidateString(tenHoatChat);

        // Nếu phát hiện lỗi (ký tự cấm, rỗng...), ném thông báo lỗi ngay
        if (!validation.isValid) {
            req.flash('error', validation.error);
            return res.redirect("/danhmuc/add-hoatchat");
        }

        // Nếu hợp lệ, gán lại chuỗi đã sạch (đã trim) vào biến để lưu DB
        tenHoatChat = validation.data;

        const findHoatChat = await db.dm_hoatchat.findOne({ where: { tenHoatChat, status: "active" } });
        if (findHoatChat) {
            req.flash('error', "Tên hoạt chất đã tồn tại vui lòng nhập tên khác!");
            return res.redirect("/danhmuc/add-hoatchat");
        }
        await db.dm_hoatchat.create({ tenHoatChat, ghiChu, status });
        req.flash('success', "Thêm hoạt chất thành công!");
        return res.redirect('/danhmuc/add-hoatchat');
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const updateHoatChat = async (req, res, next) => {
    try {
        const { id, tenHoatChat, ghiChu, status } = req.body;
        const hoatchat = await db.dm_hoatchat.findByPk(id);
        if (!hoatchat) {
            req.flash('error', "Hoạt chất không tồn tại !");
            return res.redirect(req.get('Referer') || '/danhmuc/hoatchat');
        }
        const validation = cleanAndValidateString(tenHoatChat);
        if (!validation.isValid) {
            req.flash('error', validation.error);
            return res.redirect("/danhmuc/hoatchat");
        }
        tenHoatChat = validation.data;
        const findHoatChat = await db.dm_hoatchat.findOne({
            where: {
                tenHoatChat,
                id: {
                    [Op.ne]: id
                }
            }
        });
        if (findHoatChat) {
            req.flash('error', "Tên hoạt chất đã tồn tại vui lòng nhập tên khác!");
            return res.redirect("/danhmuc/hoatchat");
        }
        await db.dm_hoatchat.update({ tenHoatChat, ghiChu, status }, { where: { id } });
        req.flash('success', "Cập nhật hoạt chất thành công!");
        return res.redirect("/danhmuc/hoatchat");
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const deleteHoatChat = async (req, res, next) => {
    try {
        const id = req.query.id || '';
        const hoatchat = await db.dm_hoatchat.findByPk(id);
        if (!hoatchat) {
            req.flash('error', "Hoạt chất không tồn tại !");
            return res.redirect(req.get('Referer') || '/danhmuc/hoatchat');
        }
        await db.dm_hoatchat.destroy({ where: { id } });
        req.flash('success', "Xóa hoạt chất thành công!");
        return res.redirect("/danhmuc/hoatchat");
    } catch (e) {
        console.log(e);
        next(e);
    }
}

const getSanPham = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const search = req.query.search || '';
        const sanphams = await db.dm_sanpham.findAll({
            where: {
                tenSanPham: { [Op.like]: `%${search}%` }
            },
            include: {
                model: db.dm_sanpham_hoatchat,
                as: 'hoatchats'
            }
        });

        const contextDist = {
            title: "Danh sách sản phẩm",
            errorMessages, successMessages,
            sanphams
        };
        return res.render('./danhmuc/danhmucsanpham', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const postUpdateSanPham = async (req, res, next) => {
    // 1. Lấy ID sản phẩm cần update từ URL (ví dụ: /danhmuc/update-sanpham/:id)
    const id = req.query.id || '';

    // Khởi tạo transaction để bảo vệ toàn vẹn dữ liệu
    const transaction = await db.sequelize.transaction();
    try {
        // console.log("body update:", req.body);

        // Lấy dữ liệu từ form, dùng let để có thể làm sạch (clean) dữ liệu
        let { tenSanPham, dangBaoChe, quyCachDongGoi, soDangKy, ghiChu, status, tenHoatChat } = req.body;

        // 2. Kiểm tra xem sản phẩm có tồn tại trong DB không trước khi làm việc
        const sanphamHienTai = await db.dm_sanpham.findByPk(id, { transaction });
        if (!sanphamHienTai) {
            await transaction.rollback();
            req.flash('error', "Sản phẩm không tồn tại hoặc đã bị xóa trước đó!");
            return res.redirect("/danhmuc/danh-sach-sanpham");
        }

        // 3. Tiến hành validate tên sản phẩm (Sử dụng hàm cleanAndValidateString bạn đã viết)
        const validation = cleanAndValidateString(tenSanPham);
        if (!validation.isValid) {
            await transaction.rollback(); // BẮT BUỘC: Rollback trước khi redirect để tránh treo kết nối DB
            req.flash('error', validation.error);
            return res.redirect(`/danhmuc/update-sanpham/${id}`);
        }
        tenSanPham = validation.data; // Gán lại tên sản phẩm đã được trim sạch sẽ

        // 4. Cập nhật thông tin bảng sản phẩm (dm_sanpham)
        await db.dm_sanpham.update({
            tenSanPham,
            dangBaoChe,
            quyCachDongGoi,
            soDangKy,
            ghiChu,
            status
        }, {
            where: { id: id },
            transaction
        });

        // 5. Xử lý cập nhật mảng hoạt chất (dm_sanpham_hoatchat)
        // // Bẫy lỗi: Đảm bảo tenHoatChat luôn là mảng (kể cả khi form chỉ gửi lên 1 chuỗi hoặc rỗng)
        // const danhSachHoatChat = Array.isArray(tenHoatChat)
        //     ? tenHoatChat
        //     : (tenHoatChat ? [tenHoatChat] : []);

        // // BƯỚC THẦN THÁNH: Xóa hết các hoạt chất cũ của sản phẩm này đi
        // await db.dm_sanpham_hoatchat.destroy({
        //     where: { idDmSanPham: id },
        //     transaction
        // });

        // // Nếu mảng mới có dữ liệu, tiến hành bulkCreate lại từ đầu
        // if (danhSachHoatChat.length > 0) {
        //     const hoatChatData = danhSachHoatChat.map(item => ({
        //         idDmSanPham: id, // ID sản phẩm cần map sang bảng phụ
        //         tenHoatChat: typeof item === 'string' ? item.trim() : item
        //     }));

        //     // Chèn loạt hoạt chất mới vào
        //     await db.dm_sanpham_hoatchat.bulkCreate(hoatChatData, { transaction });
        // }
        // 1. Chuẩn hóa mảng mới từ Form gửi lên (luôn là mảng đã trim sạch)
        const danhSachHoatChatMoi = (
            Array.isArray(tenHoatChat)
                ? tenHoatChat
                : (tenHoatChat ? [tenHoatChat] : [])
        ).map(item => (typeof item === 'string' ? item.trim() : item)).filter(Boolean);
        // .filter(Boolean) để loại bỏ các chuỗi rỗng nếu có

        // 2. Lấy danh sách hoạt chất HIỆN TẠI đang có trong Database của sản phẩm này
        const hoatChatHienTai = await db.dm_sanpham_hoatchat.findAll({
            where: { idDmSanPham: id },
            attributes: ['tenHoatChat'],
            raw: true,
            transaction
        });

        // Chuyển mảng Object từ DB thành mảng các chuỗi đơn thuần để dễ so sánh
        // Ví dụ: [{tenHoatChat: 'A'}, {tenHoatChat: 'B'}] -> ['A', 'B']
        const danhSachHoatChatCu = hoatChatHienTai.map(hc => hc.tenHoatChat.trim());

        // 3. SO SÁNH: Kiểm tra xem 2 mảng cũ và mới có KHÁC nhau không
        // Sắp xếp (sort) cả 2 mảng để tránh trường hợp đổi thứ tự nhập (ví dụ: ['A', 'B'] so với ['B', 'A'])
        const isChanged = JSON.stringify([...danhSachHoatChatMoi].sort()) !== JSON.stringify([...danhSachHoatChatCu].sort());

        // 4. CHỈ HÀNH ĐỘNG KHI CÓ SỰ THAY ĐỔI
        if (isChanged) {
            console.log("Phát hiện thay đổi hoạt chất! Tiến hành cập nhật...");

            // BƯỚC THẦN THÁNH: Xóa hết các hoạt chất cũ
            await db.dm_sanpham_hoatchat.destroy({
                where: { idDmSanPham: id },
                transaction
            });

            // Nếu mảng mới có dữ liệu, tiến hành bulkCreate lại
            if (danhSachHoatChatMoi.length > 0) {
                const hoatChatData = danhSachHoatChatMoi.map(item => ({
                    idDmSanPham: id,
                    tenHoatChat: item
                }));

                await db.dm_sanpham_hoatchat.bulkCreate(hoatChatData, { transaction });
            }
        } else {
            console.log("Hoạt chất giữ nguyên, không cần thao tác với Database.");
        }
        // 6. Mọi thứ chạy mượt mà xuôi chèo mát mái -> COMMIT thay đổi vào DB
        await transaction.commit();

        req.flash('success', "Cập nhật thông tin sản phẩm thành công!");

        // Điều hướng người dùng về trang danh sách sản phẩm hiện tại
        return res.redirect("/danhmuc/sanpham");

    } catch (e) {
        // Nếu có bất kỳ lỗi hệ thống nào (lỗi DB, lỗi code...), lập tức hủy toàn bộ các thao tác trên
        await transaction.rollback();
        console.error("Lỗi cập nhật sản phẩm:", e);
        next(e);
    }
}
const getTenHoatChatAPI = async (req, res, next) => {
    try {
        const term = req.query.term || '';
        const hoatchats = await db.dm_hoatchat.findAll({
            where: {
                tenHoatChat: { [Op.like]: `%${term}%` },
                status: "active",
            },
            raw: true
        });
        return res.json(hoatchats);
    } catch (e) {
        console.log(e);
        next(e);
    }
}
const deleteSanPham = async (req, res, next) => {
    try {
        const id = req.query.id || '';
        const sanpham = await db.dm_sanpham.findByPk(id);
        if (!sanpham) {
            req.flash('error', "Sản phẩm không tồn tại !");
            return res.redirect(req.get('Referer') || '/danhmuc/sanpham');
        }
        await sanpham.destroy();
        req.flash('success', "Xóa sản phẩm thành công!");
        return res.redirect("/danhmuc/sanpham");
    } catch (e) {
        console.log(e);
        next(e);
    }
}
module.exports = {
    deleteSanPham,
    postUpdateSanPham,
    getTenHoatChatAPI,
    getSanPham,
    postAddSanPham,
    getAddSanPham,
    deleteHoatChat,
    updateHoatChat,
    postAddHoatChat,
    getHoatChat,
    addHoatChat,
    getDanhMuc
}