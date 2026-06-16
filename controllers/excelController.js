const db = require("../models/index");
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');
const cleanAndValidateString = require('./checkString'); // Đổi tên file cho đúng

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const getImportPage = async (req, res, next) => {
    try {
        res.render('./sanxuat/import_excel', {
            title: "Import Dữ liệu Sản xuất",
            errorMessages: req.flash('error'),
            successMessages: req.flash('success'),
            infoMessages: req.flash('info')
        });
    } catch (e) {
        next(e);
    }
};

// ============================================================
// CÁC HÀM HỖ TRỢ ĐỌC / CHUYỂN ĐỔI DỮ LIỆU
// ============================================================

// Lấy giá trị "thô" của 1 ô theo địa chỉ cột (ví dụ 'C', 'AA', 'BR'...)
// Xử lý luôn trường hợp ô là công thức (formula) hoặc rich text
const getRawCell = (row, colLetter) => {
    const cell = row.getCell(colLetter);
    let v = cell ? cell.value : null;
    if (v === null || v === undefined) return null;

    if (typeof v === 'object') {
        if (v.result !== undefined) v = v.result;          // ô công thức
        else if (v.richText) v = v.richText.map(t => t.text).join(''); // rich text
        else if (v.text !== undefined) v = v.text;          // hyperlink text
    }
    return v;
};

// Lấy giá trị dạng chuỗi đã trim, trả về null nếu trống
const getStr = (row, colLetter) => {
    const v = getRawCell(row, colLetter);
    if (v === null || v === undefined) return null;
    if (v instanceof Date) return v; // để nguyên, các hàm parse ngày sẽ xử lý riêng
    const str = String(v).trim();
    return str === '' ? null : str;
};

// Parse các định dạng ngày kiểu Việt Nam: DD/MM/YY hoặc DD/MM/YYYY (hoặc Date object có sẵn)
const parseVNDate = (row, colLetter) => {
    const v = getRawCell(row, colLetter);
    if (v === null || v === undefined) return null;
    if (v instanceof Date) return v;

    const str = String(v).trim();
    if (!str) return null;

    const m = moment(str, ['DD/MM/YYYY', 'DD/MM/YY', 'D/M/YYYY', 'D/M/YY'], true);
    return m.isValid() ? m.toDate() : null;
};

// Chuẩn hóa các giá trị "Định lượng" về dạng số phần trăm (cho cột DECIMAL(5,2))
// Một số ô ghi "100.3%" (chuỗi), một số ô ghi 0.986 hoặc 1.07 (số thập phân tương đương %)
const toPercent = (row, colLetter) => {
    const v = getRawCell(row, colLetter);
    if (v === null || v === undefined || v === '') return null;

    if (typeof v === 'string') {
        const hasPercent = v.includes('%');
        const cleaned = v.replace('%', '').replace(',', '.').trim();
        if (cleaned === '') return null;
        const num = parseFloat(cleaned);
        if (isNaN(num)) return null;
        return hasPercent ? num : (Math.abs(num) <= 10 ? num * 100 : num);
    }

    const num = parseFloat(v);
    if (isNaN(num)) return null;
    // Nếu số rất nhỏ (<=10) coi như đang ở dạng phân số (0.986 = 98.6%)
    return Math.abs(num) <= 10 ? num * 100 : num;
};

// Chuyển ô "TĐ" (thẩm định) thành boolean
const toBoolean = (row, colLetter) => {
    const v = getStr(row, colLetter);
    if (!v) return false;
    const normalized = String(v).trim().toLowerCase();
    return ['x', 'có', 'co', 'true', '1', 'yes', 'đạt', 'dat', 'TĐ', 'TD'].includes(normalized);
};

// ============================================================
// IMPORT EXCEL - DANH SÁCH SẢN PHẨM (vien_com.xlsx)
// ============================================================
//
// Cấu trúc file (3 dòng tiêu đề, dữ liệu từ dòng 4):
//   A: STT
//   B: nk                (chưa map - chưa rõ mục đích)
//   C: Số lô              -> losanxuat.soLo
//   D: TĐ (thẩm định)     -> losanxuat.thamDinh
//   E: Tên sản phẩm       -> losanxuat.tenSanPham
//   F: Họat chất          -> hoatchatsanxuat.tenHoatChat (hoạt chất 1)
//   G: Dạng BC            -> losanxuat.dangBaoChe
//   H: QCĐG               -> losanxuat.quyCachDongGoi
//   I: Cỡ lô              -> losanxuat.coLo
//   J: Ghi chú/Xử lý/Tách lô -> losanxuat.ghiChu
//
//   ----- THÔNG TIN PHA CHẾ - ĐÓNG GÓI (thongtinphache) -----
//   K: Ngày PC            -> ngayPhache
//   L: Hệ số bù           -> heSoBu
//   M: Độ ẩm cốm màu 1 - Sấy -> say1
//   N: Độ ẩm cốm màu 1 - THT -> THT1
//   O: Độ ẩm cốm màu 1 - Viên -> vien1
//   P: Độ ẩm cốm màu 2 - sấy -> say2
//   Q: Độ ẩm cốm màu 2 - THT -> THT2
//   R: Độ ẩm cốm màu 2 - Viên -> vien2
//   S: Độ cứng           -> doCung
//   T: Độ rã (phút)       -> doRa
//   U: Độ mài mòn         -> doMayMon
//   V: Ngày ĐG cấp 1      -> ngayDongGoiCap1
//   W: Khối lượng cốm     -> khoiLuongCom
//   X: Số lượng giao nộp  -> khoiLuongGiaoNop
//
//   ----- BTP - CỐM (BTPcom) -----
//   Y: KLV (yêu cầu dập)  -> KLV_yeucaudap
//   Z: KLV (QC ra phiếu)  -> KLV_QC
//   AA: ĐL - Hoạt chất 1  -> hoatchatsanxuat#1.BTP_dinhLuong
//   AB: ĐL - Hoạt chất 2  -> hoatchatsanxuat#2.BTP_dinhLuong (nếu có)
//   AC: Tạp đơn           -> tapDon
//   AD: Tạp khác          -> tapKhac
//   AE: Tổng tạp          -> tongTap
//
//   ----- DẬP VIÊN/BAO PHIM/ĐÓNG NANG (dapvien) -----
//   AF: KLV (y.cầu)       -> KLV_yeucau
//   AG: KLV (PKN)         -> KLV_PKN
//   AH: ĐL                -> hoatchatsanxuat#1.dapVien_dinhLuong
//   AI: Đồng đều đơn vị liều -> dongDeuDonViLieu
//   AJ: Rã                -> ra
//   AK: Hòa tan (S1)      -> hoatchatsanxuat#1.dapVien_hoatan1
//   AL: Hòa tan (S2)      -> hoatchatsanxuat#1.dapVien_hoatan2
//   AM: Tạp đơn           -> tapDon
//   AN: Tạp khác          -> tapKhac
//   AO: Tổng tạp          -> tongTap
//
//   ----- THÀNH PHẨM (thanhpham + hoatchatsanxuat) -----
//   AP: Ngày kiểm         -> thanhpham.ngayKiem
//   AQ: Lô CF             -> thanhpham.loCF
//   AR: KLV               -> thanhpham.KLV
//   AS: ĐL - Hoạt chất 1  -> hoatchatsanxuat#1.thanhPham_dinhLuong
//   AT: ĐL - Hoạt chất 2  -> hoatchatsanxuat#2.thanhPham_dinhLuong (nếu có)
//   AU: Độ rã             -> hoatchatsanxuat#1.thanhPham_doRa
//   AV-BA: Hòa tan (S1) Viên 1-6 -> hoatchatsanxuat#1.thanhPham_hoatan1_vien1-6
//   BB-BG: Hòa tan (S2) Viên 1-6 -> hoatchatsanxuat#1.thanhPham_hoatan2_vien1-6
//   BH: Tạp đơn           -> thanhpham.tapDon
//   BI: Tạp khác          -> thanhpham.tapKhac
//   BJ: Tạp 4-amino       -> thanhpham.tap4Amino
//   BK: Tổng tạp          -> thanhpham.tongTap
//   BL: (chưa rõ header)  -> chưa map
//   BM: Độ mịn - lớn      -> thanhpham.doMinLon
//   BN: Độ mịn - nhỏ      -> thanhpham.doMinNho
//   BO: Độ ẩm (%)         -> hoatchatsanxuat#1.thanhPham_doAm
//   BP: DDDVL TB %        -> hoatchatsanxuat#1.DDDVL_TB
//   BQ: DDDVL AV %        -> hoatchatsanxuat#1.DDDVL_AV
//   BR-CA: DDDVL Viên 1-10 -> hoatchatsanxuat#1.DDDVL_Vien1-10
//   CB: Số sai lệch       -> thanhpham.soSaiLech
//   CC: Số kiểm soát thay đổi -> thanhpham.soKiemSoatThayDoi
//   CD: (không có header) -> thanhpham.ghiChu (đoán)
//
const importExcel_DanhSachSanPham = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        if (!req.file) throw new Error("Vui lòng chọn file Excel!");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.getWorksheet(1);

        let count = 0;
        const newLots = [];      // các số lô mới tạo
        const updatedLots = [];  // các số lô đã tồn tại, được cập nhật
        const lastRow = worksheet.actualRowCount || worksheet.rowCount;

        // Dữ liệu bắt đầu từ dòng 4 (3 dòng đầu là tiêu đề 3 tầng)
        for (let rowNumber = 4; rowNumber <= lastRow; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const soLo = getStr(row, 'C');
            if (!soLo) continue; // bỏ qua dòng trống / không có số lô

            // ---------- 1. THÔNG TIN CHUNG (losanxuat) ----------
            const losanxuatInfo = {
                soLo,
                tenSanPham: getStr(row, 'E'),
                dangBaoChe: getStr(row, 'G'),
                quyCachDongGoi: getStr(row, 'H'),
                coLo: getStr(row, 'I'),
                ghiChu: getStr(row, 'J'),
                thamDinh: toBoolean(row, 'D'),
                status: 'active'
            };

            const [lot, created] = await db.losanxuat.findOrCreate({
                where: { soLo },
                defaults: losanxuatInfo,
                transaction
            });
            if (created) {
                newLots.push(soLo);
            } else {
                updatedLots.push(soLo);
                await lot.update(losanxuatInfo, { transaction });
            }

            // ---------- 2. THÔNG TIN PHA CHẾ - ĐÓNG GÓI (thongtinphache) ----------
            await db.thongtinphache.upsert({
                losanxuatId: lot.id,
                ngayPhache: parseVNDate(row, 'K'),
                heSoBu: getStr(row, 'L'),
                say1: getStr(row, 'M'),
                THT1: getStr(row, 'N'),
                vien1: getStr(row, 'O'),
                say2: getStr(row, 'P'),
                THT2: getStr(row, 'Q'),
                vien2: getStr(row, 'R'),
                doCung: getStr(row, 'S'),
                doRa: getStr(row, 'T'),
                doMayMon: getStr(row, 'U'),
                ngayDongGoiCap1: parseVNDate(row, 'V'),
                khoiLuongCom: getStr(row, 'W'),
                khoiLuongGiaoNop: getStr(row, 'X')
            }, { transaction });

            // ---------- 3. BTP - CỐM (BTPcom) ----------
            await db.BTPcom.upsert({
                losanxuatId: lot.id,
                KLV_yeucaudap: getStr(row, 'Y'),
                KLV_QC: getStr(row, 'Z'),
                tapDon: getStr(row, 'AC'),
                tapKhac: getStr(row, 'AD'),
                tongTap: getStr(row, 'AE')
            }, { transaction });

            // ---------- 4. DẬP VIÊN/BAO PHIM/ĐÓNG NANG (dapvien) ----------
            await db.dapvien.upsert({
                losanxuatId: lot.id,
                KLV_yeucau: getStr(row, 'AF'),
                KLV_PKN: getStr(row, 'AG'),
                dongDeuDonViLieu: getStr(row, 'AI'),
                ra: getStr(row, 'AJ'),
                tapDon: getStr(row, 'AM'),
                tapKhac: getStr(row, 'AN'),
                tongTap: getStr(row, 'AO')
            }, { transaction });

            // ---------- 5. THÀNH PHẨM (thanhpham) ----------
            await db.thanhpham.upsert({
                losanxuatId: lot.id,
                ngayKiem: parseVNDate(row, 'AP'),
                loCF: getStr(row, 'AQ'),
                KLV: getStr(row, 'AR'),
                tapDon: getStr(row, 'BH'),
                tapKhac: getStr(row, 'BI'),
                tap4Amino: getStr(row, 'BJ'),
                tongTap: getStr(row, 'BK'),
                doMinLon: getStr(row, 'BM'),
                doMinNho: getStr(row, 'BN'),
                soSaiLech: getStr(row, 'CB'),
                soKiemSoatThayDoi: getStr(row, 'CC'),
                ghiChu: getStr(row, 'CD')
            }, { transaction });

            // ---------- 6. HOẠT CHẤT 1 (hoatchatsanxuat) ----------
            const tenHoatChat1 = getStr(row, 'F') || 'Hoạt chất 1';
            const hoatChat1Data = {
                losanxuatId: lot.id,
                tenHoatChat: tenHoatChat1,
                BTP_dinhLuong: toPercent(row, 'AA'),
                dapVien_dinhLuong: toPercent(row, 'AH'),
                dapVien_hoatan1: getStr(row, 'AK'),
                dapVien_hoatan2: getStr(row, 'AL'),
                thanhPham_dinhLuong: toPercent(row, 'AS'),
                thanhPham_doRa: getStr(row, 'AU'),
                thanhPham_hoatan1_vien1: getStr(row, 'AV'),
                thanhPham_hoatan1_vien2: getStr(row, 'AW'),
                thanhPham_hoatan1_vien3: getStr(row, 'AX'),
                thanhPham_hoatan1_vien4: getStr(row, 'AY'),
                thanhPham_hoatan1_vien5: getStr(row, 'AZ'),
                thanhPham_hoatan1_vien6: getStr(row, 'BA'),
                thanhPham_hoatan2_vien1: getStr(row, 'BB'),
                thanhPham_hoatan2_vien2: getStr(row, 'BC'),
                thanhPham_hoatan2_vien3: getStr(row, 'BD'),
                thanhPham_hoatan2_vien4: getStr(row, 'BE'),
                thanhPham_hoatan2_vien5: getStr(row, 'BF'),
                thanhPham_hoatan2_vien6: getStr(row, 'BG'),
                thanhPham_doAm: getStr(row, 'BO'),
                DDDVL_TB: getStr(row, 'BP'),
                DDDVL_AV: getStr(row, 'BQ'),
                DDDVL_Vien1: getStr(row, 'BR'),
                DDDVL_Vien2: getStr(row, 'BS'),
                DDDVL_Vien3: getStr(row, 'BT'),
                DDDVL_Vien4: getStr(row, 'BU'),
                DDDVL_Vien5: getStr(row, 'BV'),
                DDDVL_Vien6: getStr(row, 'BW'),
                DDDVL_Vien7: getStr(row, 'BX'),
                DDDVL_Vien8: getStr(row, 'BY'),
                DDDVL_Vien9: getStr(row, 'BZ'),
                DDDVL_Vien10: getStr(row, 'CA')
            };

            const [hc1Record] = await db.hoatchatsanxuat.findOrCreate({
                where: { losanxuatId: lot.id, tenHoatChat: tenHoatChat1 },
                defaults: hoatChat1Data,
                transaction
            });
            await hc1Record.update(hoatChat1Data, { transaction });

            // ---------- 7. HOẠT CHẤT 2 (chỉ tạo nếu có dữ liệu ở cột AB hoặc AT) ----------
            const dinhLuong2_BTP = toPercent(row, 'AB');
            const dinhLuong2_TP = toPercent(row, 'AT');

            if (dinhLuong2_BTP !== null || dinhLuong2_TP !== null) {
                const tenHoatChat2 = 'Hoạt chất 2';
                const hoatChat2Data = {
                    losanxuatId: lot.id,
                    tenHoatChat: tenHoatChat2,
                    BTP_dinhLuong: dinhLuong2_BTP,
                    thanhPham_dinhLuong: dinhLuong2_TP
                };

                const [hc2Record] = await db.hoatchatsanxuat.findOrCreate({
                    where: { losanxuatId: lot.id, tenHoatChat: tenHoatChat2 },
                    defaults: hoatChat2Data,
                    transaction
                });
                await hc2Record.update(hoatChat2Data, { transaction });
            }

            count++;
        }

        await transaction.commit();

        // Xóa file tạm sau khi xử lý xong
        if (req.file) fs.unlinkSync(req.file.path);

        req.flash('success', `Import thành công ${count} lô sản xuất! (${newLots.length} lô mới, ${updatedLots.length} lô đã tồn tại được cập nhật)`);
        if (updatedLots.length > 0) {
            req.flash('info', `Các số lô đã tồn tại từ trước và được cập nhật lại: ${updatedLots.join(', ')}`);
        }
        res.redirect('/sanxuat/get-excel');
    } catch (e) {
        if (transaction) await transaction.rollback();
        if (req.file) fs.unlinkSync(req.file.path);
        console.error(e);
        req.flash('error', "Lỗi Import: " + e.message);
        res.redirect('/sanxuat/get-excel');
    }
};

const exportExcel_DanhSachSanPham = async (req, res, next) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách sản phẩm');

        const data = await db.losanxuat.findAll({
            include: [
                {
                    model: db.hoatchatsanxuat,
                    as: "hoatchats"
                },
                {
                    model: db.thongtinphache,
                    as: "phache"
                },
                {
                    model: db.dapvien,
                    as: "dapvien"
                },
                {
                    model: db.thanhpham,
                    as: "thanhpham"
                },
                {
                    model: db.BTPcom,
                    as: "BTPcom"
                }
            ]
        });

        // 2. TẠO TIÊU ĐỀ LỚN (Hàng 1)
        worksheet.mergeCells('A1:AH1'); // Gộp từ cột A đến AH 
        const titleRow = worksheet.getCell('A1');
        titleRow.value = 'ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM HẰNG NĂM';
        titleRow.font = { name: 'Arial', size: 18, bold: true };
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 40;

        // 3. ĐỊNH NGHĨA TIÊU ĐỀ 2 TẦNG (Hàng 2 và Hàng 3)
        // Hàng 2: Các cột đơn lẻ và các nhóm lớn
        const row2 = worksheet.getRow(2);
        row2.values = [
            'STT', 'SẢN PHẨM', 'SĐK', 'Dạng bào chế', 'HD', 'SỐ LƯỢNG SX', 'SỐ LÔ', 'Hoạt chất',
            'KLV (mg)',
            'ĐỊNH LƯỢNG (%)(Dập viên...)',
            'ĐỊNH LƯỢNG (%)(Thành phẩm)',
            'Độ rã (phút)',
            'HÒA TAN (%)(Dập viên...)', '', '', '', '', '', '', '',
            'HÒA TAN (%) (Thành phẩm)', '', '', '', '', '', '', '',
            'Độ ẩm (%)',
            'Đồng đều đơn vị liều (%)', '', '', '',
            'GHI CHÚ'
        ];

        // Hàng 3: Các cột con bên dưới tiêu đề lớn
        const row3 = worksheet.getRow(3);
        row3.values = [
            '', '', '', '', '', '', '', '', '', '', '', '', // Bỏ trống các cột đã gộp dọc
            'Viên 1', 'Viên 2', 'Viên 3', 'Viên 4', 'Viên 5', 'Viên 6', 'MIN', 'MAX',        // Hòa tan dập viên
            'Viên 1', 'Viên 2', 'Viên 3', 'Viên 4', 'Viên 5', 'Viên 6', 'MIN', 'MAX',        // Hòa tan thành phẩm
            '',                                                                             // Độ ẩm
            'MIN', 'MAX', 'AV', 'TB',                                                       // Đồng đều đơn vị liều
            ''                   // Ghi chú
        ];

        // Thiết lập chiều cao cho hàng tiêu đề cột
        row2.height = 25;
        row3.height = 20;

        // 4. TIẾN HÀNH GỘP Ô TIÊU ĐỀ (MERGE CELLS)
        // Gộp dọc (Merge dọc từ hàng 2 đến hàng 3)
        worksheet.mergeCells('A2:A3'); // STT
        worksheet.mergeCells('B2:B3'); // SẢN PHẨM
        worksheet.mergeCells('C2:C3'); // SĐK
        worksheet.mergeCells('D2:D3'); // Dạng bào chế
        worksheet.mergeCells('E2:E3'); // HD
        worksheet.mergeCells('F2:F3'); // SỐ LƯỢNG SX
        worksheet.mergeCells('G2:G3'); // SỐ LÔ
        worksheet.mergeCells('H2:H3'); // Hoạt chất
        worksheet.mergeCells('I2:I3'); // KLV (Cột H, I, J)
        worksheet.mergeCells('J2:J3'); // ĐỊNH LƯỢNG (%)(Dập viên...)
        worksheet.mergeCells('K2:K3'); // ĐỊNH LƯỢNG (%)(Thành phẩm)
        worksheet.mergeCells('L2:L3'); // Độ rã (Cột N, O)
        worksheet.mergeCells('AC2:AC3'); // Độ ẩm
        worksheet.mergeCells('AH2:AH3'); // GHI CHÚ

        // Gộp ngang (Merge ngang ở hàng 2)
        worksheet.mergeCells('M2:T2'); // Hoà tan dập viên
        worksheet.mergeCells('U2:AB2'); // Hóa tan thành phẩm
        worksheet.mergeCells('AD2:AG2'); // Đồng đều đơn vị liều

        // 5. ĐỊNH DẠNG STYLE CHO TIÊU ĐỀ (Border, Alignment, Font)
        const borderStyle = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        for (let r = 2; r <= 3; r++) {
            const row = worksheet.getRow(r);
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { name: 'Arial', size: 10, bold: true };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = borderStyle;
            });
        }

        // Cấu hình độ rộng các cột cho vừa vặn giống ảnh
        const colWidths = {
            A: 6, B: 25, C: 15, D: 15, E: 8, F: 15, G: 10, // Thông tin chung
            H: 30, I: 10, J: 8,                             // TLV
            K: 10, L: 10, M: 8,                             // Định lượng
            N: 8, O: 8, P: 8, Q: 8, R: 8, S: 8, T: 8, U: 8, // Các chỉ tiêu còn lại
            V: 8, W: 8, X: 8, Y: 8, Z: 8, AA: 8, AB: 8, AC: 8,
            AD: 8, AE: 8, AF: 8, AG: 8, AH: 30              // Ghi chú
        };
        Object.keys(colWidths).forEach(col => {
            worksheet.getColumn(col).width = colWidths[col];
        });


        // 6. ĐỔ DỮ LIỆU VÀO BẢNG
        let currentExcelRow = 4; // Dữ liệu bắt đầu từ hàng 4
        data.forEach((item, lotIndex) => {
            // Lấy danh sách hoạt chất, nếu không có thì giả định mảng rỗng để vẫn hiện thông tin lô
            const hoatChats = (item.hoatchats && item.hoatchats.length > 0) ? item.hoatchats : [{}];
            const startLotRow = currentExcelRow;

            hoatChats.forEach((hc) => {
                // Thu thập dữ liệu hòa tan để tính MIN/MAX (bỏ qua giá trị trống)
                const htDVValues = [
                    hc.dapVien_hoatan1_vien1, hc.dapVien_hoatan1_vien2, hc.dapVien_hoatan1_vien3,
                    hc.dapVien_hoatan1_vien4, hc.dapVien_hoatan1_vien5, hc.dapVien_hoatan1_vien6
                ].map(v => parseFloat(v)).filter(v => !isNaN(v));

                const htTPValues = [
                    hc.thanhPham_hoatan1_vien1, hc.thanhPham_hoatan1_vien2, hc.thanhPham_hoatan1_vien3,
                    hc.thanhPham_hoatan1_vien4, hc.thanhPham_hoatan1_vien5, hc.thanhPham_hoatan1_vien6
                ].map(v => parseFloat(v)).filter(v => !isNaN(v));

                // Thu thập dữ liệu DDDVL để tính MIN/MAX (từ Viên 1 đến Viên 10)
                const dddvlValues = [
                    hc.DDDVL_Vien1, hc.DDDVL_Vien2, hc.DDDVL_Vien3, hc.DDDVL_Vien4, hc.DDDVL_Vien5,
                    hc.DDDVL_Vien6, hc.DDDVL_Vien7, hc.DDDVL_Vien8, hc.DDDVL_Vien9, hc.DDDVL_Vien10
                ].map(v => parseFloat(v)).filter(v => !isNaN(v));

                const rowValues = [
                    lotIndex + 1,                       // A: STT
                    item.tenSanPham || '',              // B: Sản phẩm
                    item.soDangKy || '',                // C: SĐK
                    item.dangBaoChe || '',              // D: Dạng bào chế
                    item.hd || '',                      // E: HD
                    item.coLo || 0,                     // F: Cỡ lô
                    item.soLo || '',                    // G: Số lô
                    hc.tenHoatChat || '',               // H: Hoạt chất (Phần quan trọng nhất)
                    item.thanhpham ? `${item.thanhpham.KLV}` : '', // I: KLV (mg)
                    hc.dapVien_dinhLuong || '',         // J: Định lượng DV (%)
                    hc.thanhPham_dinhLuong || '',       // K: Định lượng TP (%)
                    hc.thanhPham_doRa || '',            // L: Độ rã (phút)
                    hc.dapVien_hoatan1_vien1 || '',     // M: DV V1
                    hc.dapVien_hoatan1_vien2 || '',     // N: DV V2
                    hc.dapVien_hoatan1_vien3 || '',     // O: DV V3
                    hc.dapVien_hoatan1_vien4 || '',     // P: DV V4
                    hc.dapVien_hoatan1_vien5 || '',     // Q: DV V5
                    hc.dapVien_hoatan1_vien6 || '',     // R: DV V6
                    htDVValues.length ? Math.min(...htDVValues) : '', // S: MIN DV
                    htDVValues.length ? Math.max(...htDVValues) : '', // T: MAX DV
                    hc.thanhPham_hoatan1_vien1 || '',   // U: TP V1
                    hc.thanhPham_hoatan1_vien2 || '',   // V: TP V2
                    hc.thanhPham_hoatan1_vien3 || '',   // W: TP V3
                    hc.thanhPham_hoatan1_vien4 || '',   // X: TP V4
                    hc.thanhPham_hoatan1_vien5 || '',   // Y: TP V5
                    hc.thanhPham_hoatan1_vien6 || '',   // Z: TP V6
                    htTPValues.length ? Math.min(...htTPValues) : '', // AA: MIN TP
                    htTPValues.length ? Math.max(...htTPValues) : '', // AB: MAX TP
                    hc.thanhPham_doAm || '',            // AC: Độ ẩm
                    dddvlValues.length ? Math.min(...dddvlValues) : '', // AD: DDDVL MIN
                    dddvlValues.length ? Math.max(...dddvlValues) : '', // AE: DDDVL MAX
                    hc.DDDVL_AV || '',                  // AF: DDDVL AV
                    hc.DDDVL_TB || '',                  // AG: DDDVL TB
                    item.ghiChu || ''                   // AH: Ghi chú
                ];

                const addedRow = worksheet.addRow(rowValues);
                addedRow.height = 20;

                addedRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.border = borderStyle;
                    cell.font = { name: 'Arial', size: 10 };

                    // Căn lề tùy theo loại dữ liệu
                    if ([1, 3, 4, 5, 7].includes(colNumber)) {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    } else if ([2, 8, 34].includes(colNumber)) { // Sản phẩm, Hoạt chất, Ghi chú (AH = 34)
                        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    } else {
                        cell.alignment = { vertical: 'middle', horizontal: 'right' };
                        if (typeof cell.value === 'number') {
                            cell.numFmt = '#,##0.00';
                        }
                    }
                });
                currentExcelRow++;
            });

            // TIẾN HÀNH GỘP Ô CHO LÔ NÀY (Nếu lô có nhiều hơn 1 hoạt chất)
            if (hoatChats.length > 1) {
                const endLotRow = currentExcelRow - 1;
                // Các cột chứa thông tin chung của lô cần gộp dọc
                const mergeCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'AH'];
                mergeCols.forEach(col => {
                    worksheet.mergeCells(`${col}${startLotRow}:${col}${endLotRow}`);
                });
            }
        });

        // 7. TRẢ FILE VỀ CLIENT
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=danh_sach_san_pham.xlsx');
        res.send(buffer);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = {
    exportExcel_DanhSachSanPham,
    getImportPage,
    importExcel_DanhSachSanPham
}