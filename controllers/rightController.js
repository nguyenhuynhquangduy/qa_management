const express = require("express");
const db = require("../models/index");
const passport = require('passport');
const moment = require('moment');
const { Op, where } = require("sequelize");
const bcrypt = require('bcrypt');

const getRightsGroup = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const search = req.query.search || '';
        const rightsGroup = await db.nhomquyen.findAll({
            where:
                { TenNQ: { [Op.like]: `%${search}%` } }

        })
        // console.log("rightsGroup:", rightsGroup);
        const contextDist = {
            errorMessages, successMessages,
            title: "Nhóm Quyền", rightsGroup
        };
        return res.render('./rights/rightsGroup', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
};
const postRightsGroup = async (req, res, next) => {
    try {
        const { TenNQ } = req.body;
        const checkTenNQ = await db.nhomquyen.findOne({ where: { TenNQ } });
        if (checkTenNQ) {
            req.flash("error", "Tên nhóm đã tồn tại!");
            return res.redirect('/rights/rights-group');
        }
        const rightsGroup = await db.nhomquyen.create({ TenNQ });
        req.flash("success", "Thêm nhóm thành công!");
        return res.redirect(req.get("Referer") || ("/"));
    } catch (e) {
        console.log(e);
        next(e);
    }
};

const updateRightsGroup = async (req, res, next) => {
    try {
        const { MANQ, TenNQ } = req.body;
        const checkTenNQ = await db.nhomquyen.findOne({ where: { TenNQ } });
        if (checkTenNQ) {
            req.flash("error", "Tên nhóm đã tồn tại!");
            return res.redirect('/rights/rights-group');
        }
        const rightsGroup = await db.nhomquyen.update({ TenNQ }, { where: { MANQ } });
        req.flash("success", "Cập nhật tên nhóm thành công!");
        return res.redirect(req.get("Referer") || ("/"));
    }
    catch (e) {
        console.log(e);
        next(e);
    }
}

const deleteRightsGroup = async (req, res, next) => {
    try {
        const MANQ = req.query.id || '';

        const rightsGroup = await db.nhomquyen.findOne({
            where: { MANQ },
            include: [{
                model: db.phanquyen,
                as: 'phanquyen',
            }]
        });
        // 2. Kiểm tra nếu không tìm thấy nhóm quyền
        if (!rightsGroup) {
            // Có thể thông báo lỗi hoặc chuyển hướng nếu MANQ không tồn tại
            return res.redirect(req.get('Referer') || '/');
        }
        // 3. Kiểm tra điều kiện: Nếu mảng phanquyens có phần tử thì KHÔNG cho xóa
        if (rightsGroup.phanquyen && rightsGroup.phanquyen.length > 0) {
            // Gửi thông báo lỗi (ví dụ dùng flash message) hoặc trả về lỗi
            console.log("Không thể xóa: Nhóm quyền này đang có dữ liệu phân quyền!");
            // Bạn nên dùng req.flash hoặc gửi một biến error qua redirect nếu có thiết lập
            return res.redirect(req.get('Referer') || '/');
        }
        await db.nhomquyen.destroy({ where: { MANQ } });
        req.flash("success", "Xóa nhóm quyền thành công !");
        return res.redirect(req.get('Referer') || '/');
    } catch (e) {
        console.log(e);
        next(e);
    }
}

const getRightsManamgement = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        const rightsGroup = await db.nhomquyen.findAll(
            {
                include: [{
                    model: db.phanquyen,
                    as: 'phanquyen',
                }]
            }
        )
        // console.log("rightsGroup:", rightsGroup);
        const contextDist = {
            errorMessages, successMessages,
            title: "Quản lý quyền", rightsGroup
        };
        return res.render('./rights/rightsManagement', contextDist);

    } catch (e) {
        console.log(e);
        next(e);
    }
}

const postRights = async (req, res, next) => {
    try {
        const { MANQ, tenquyen, description } = req.body;
        if (isInvalidUsername(tenquyen)) {
            req.flash('error', 'Tên quyền không được chứa khoảng trắng thừa hoặc chỉ khoảng trắng');
            return res.redirect('back');
        }
        const rightsGroup = await db.nhomquyen.findByPk(MANQ);
        if (!rightsGroup) {
            req.flash('error', 'Nhóm quyền không tồn tại');
            return res.redirect(req.get('Referer') || '/');
        }
        const checkTenQuyen = await db.phanquyen.findOne({
            where: {
                tenquyen: tenquyen,
                MANQ: MANQ  //
            }
        })
        if (checkTenQuyen) {
            req.flash('error', "Tên quyền đã tồn tại, vui lòng chọn tên quyền khác !");
            return res.redirect(req.get('Referer') || '/');
        }

        const phanquyen = await db.phanquyen.create({ MANQ, tenquyen, description });
        req.flash("success", "Them quyen thanh cong!");
        return res.redirect(req.get("Referer") || ("/"));
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', 'Tên quyền đã tồn tại trong nhóm này');
            return res.redirect('back');
        }
        console.log(e);
        next(e);
    }

}

const updateRights = async (req, res, next) => {
    try {
        const { id, tenquyen, description } = req.body;
        if (isInvalidUsername(tenquyen)) {
            req.flash('error', 'Tên quyền không được chứa khoảng trắng thừa hoặc chỉ khoảng trắng');
            return res.redirect('back');
        }
        const phanquyen = await db.phanquyen.findByPk(id);
        if (!phanquyen) {
            req.flash('error', 'Quyền không tồn tại');
            return res.redirect(req.get('Referer') || '/');
        }
        await phanquyen.update({ tenquyen, description });
        req.flash("success", "Cập nhật thành công!");
        return res.redirect(req.get("Referer") || ("/"));
    }
    catch (e) {
        console.log(e);
        next(e);
    }
}
const deleteRights = async (req, res, next) => {
    try {
        const id = req.query.id || '';
        const phanquyen = await db.phanquyen.findByPk(id);
        if (!phanquyen) {
            req.flash("error", "Quyền không tồn tại !");
            return res.redirect(req.get('Referer') || '/');
        }
        await phanquyen.destroy();
        req.flash("success", "Xóa quyền thành công!");
        return res.redirect(req.get('Referer') || '/');
    } catch (e) {
        console.log(e);
        next(e);
    }
}
function cleanInput(value) {
    if (typeof value !== 'string') return '';

    // Xóa khoảng trắng đầu cuối
    let cleaned = value.trim();

    // Gom nhiều khoảng trắng thành 1
    cleaned = cleaned.replace(/\s+/g, ' ');

    return cleaned;
}
function isInvalidUsername(username) {
    if (typeof username !== 'string') return true;

    // rỗng hoặc chỉ khoảng trắng
    if (!username.trim()) return true;

    // có khoảng trắng đầu hoặc cuối
    if (username !== username.trim()) return true;

    // có nhiều khoảng trắng liên tiếp
    if (/\s{2,}/.test(username)) return true;

    return false;
}

// tới trang thực hiện phân quyền
const getRightsActive = async (req, res, next) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash("success");
        const taikhoanRaw = await db.taikhoan.findAll({
            where:
            {
                username: {
                    [db.Sequelize.Op.ne]: 'root'
                }
            },
        });
        const nhomquyenRaw = await db.nhomquyen.findAll(
            {
                include: [{
                    model: db.phanquyen,
                    as: 'phanquyen',
                }]
            }
        );
        // Chuyển đổi mảng các Instance thành mảng JSON
        const taikhoans = taikhoanRaw.map(el => el.get({ plain: true }));
        const nhomquyens = nhomquyenRaw.map(el => el.get({ plain: true }));
        //toJSON kém an toàn hơn
        //const taikhoans = taikhoanRaw.map(el => el.toJSON());
        /*toJSON() thường được hiểu là để chuẩn bị dữ liệu đi vào luồng JSON.stringify().

        get({ plain: true }) khẳng định mục tiêu của bạn là: "Tôi muốn một Object JS bình 
         ngay tại dòng code này để xử lý logic tiếp theo".*/
        // console.log("tai khoan:", taikhoans);
        // console.log("nhom quyen:", nhomquyens);
        const contextDist = {
            errorMessages, successMessages,
            title: "Phân quyen",
            customer: req.user,
            taikhoans, nhomquyens
        };
        return res.render('./rights/rightsActive', contextDist);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

//lấy phân quyền cho tài khoản - khi click chuột vào radio hiện ra phân quyền
const getRightOfUser = async (req, res, next) => {
    try {
        const MATK = req.query.MATK;
        const taikhoan = await db.taikhoan.findByPk(MATK, {
            include: [{
                model: db.phanquyen,
                as: 'phanquyens',
                through: { attributes: [] }
            }]
        });

        if (!taikhoan) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // Lấy tất cả các nhóm quyền và các quyền trong mỗi nhóm
        const allGroups = await db.nhomquyen.findAll({
            include: [{
                model: db.phanquyen,
                as: 'phanquyen' // As defined in the nhomquyen model
            }]
        });

        const userPermissionIds = new Set(taikhoan.phanquyens.map(p => p.id));

        const groupRights = allGroups.map(group => {
            const groupPermissions = group.phanquyen || [];
            const userPermissionsInGroupCount = groupPermissions.filter(p => userPermissionIds.has(p.id)).length;
            return {
                MANQ: group.MANQ,
                TenNQ: group.TenNQ,
                totalPermissions: groupPermissions.length,
                userPermissionsCount: userPermissionsInGroupCount
            };
        });

        // Trả về danh sách quyền của tài khoản và thông tin tổng hợp của nhóm quyền
        return res.json({
            userRights: taikhoan.phanquyens,
            groupRights: groupRights
        });

    } catch (e) {
        console.log(e);
        next(e);
    }
}
//Xữ lý lưu phân quyền cho tài khoản
const updateRightsOfUser = async (req, res, next) => {
    try {
        const { MATK, phanquyens } = req.body;
        console.log("req.body:", req.body);
        //phanquyens là mãng các ID;
        const taikhoan = await db.taikhoan.findByPk(MATK);
        if (!taikhoan) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }
        /*response.ok sẽ là false (vì status code là 404, không nằm trong khoảng 200-299).
        response.status sẽ là 404.
        response.body sẽ chứa chuỗi JSON { "message": "Tài khoản không tồn tại" }.
        dùng response.json để lấy dữ liệu thực sự từ message.
        const result = await response.json();
        throw new Error(result.message || "Lỗi khi tải quyền.");
        */
        // Kiểm tra nếu tài khoản là admin và người dùng hiện tại không phải là admin
        if (taikhoan.username === 'admin' && req.user.username !== 'admin') {
            return res.status(403).json({ message: 'Bạn không thể thay đổi quyền tài khoản admin' });
        }

        // Đảm bảo phanquyens là một mảng. Mảng rỗng sẽ xóa tất cả quyền.
        const permissionIds = phanquyens || [];
        await taikhoan.setPhanquyens(permissionIds);

        return res.json({ message: 'Cập nhật quyền thành công' });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật quyền.', error: e.message });
    }
}
module.exports = {
    updateRightsOfUser,
    getRightOfUser,
    getRightsActive,
    deleteRights,
    updateRights,
    postRights,
    getRightsManamgement,
    deleteRightsGroup,
    updateRightsGroup,
    postRightsGroup,
    getRightsGroup
};