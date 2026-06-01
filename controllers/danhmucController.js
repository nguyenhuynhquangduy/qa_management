const db = require("../models/index");
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');

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
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        console.log("Đã đến đây");
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
module.exports = {
    postAddSanPham,
    getAddSanPham,
    getDanhMuc,
}