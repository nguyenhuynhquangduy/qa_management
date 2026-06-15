const db = require("../models/index");
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');
const cleanAndValidateString = require('./checkString'); // Đổi tên file cho đúng

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Hàm hỗ trợ định dạng ngày tháng an toàn
const parseExcelDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = moment(value, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
    return d.isValid() ? d.toDate() : null;
};

const getImportPage = async (req, res, next) => {
    try {
        return res.render('./sanxuat/import_excel', {
            title: "Import Dữ liệu Sản xuất",
            errorMessages: req.flash('error'),
            successMessages: req.flash('success')
        });
    } catch (e) {
        next(e);
    }
};

const importExcel_DanhSachSanPham = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        if (!req.file) throw new Error("Vui lòng chọn file Excel!");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.getWorksheet(1);
        const dataLots = {};

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 3) return; // Bỏ qua tiêu đề
            const values = row.values;
            const soLo = values[7]?.toString().trim();
            if (!soLo) return;

            if (!dataLots[soLo]) {
                dataLots[soLo] = {
                    info: { // losanxuat
                        tenSanPham: values[2], soDangKy: values[3], dangBaoChe: values[4],
                        quyCachDongGoi: values[5], coLo: values[6], status: values[10] || 'active',
                        thamDinh: values[8] === 'x' || values[8] === 'X' || values[8] === true,
                        ghiChu: values[9]
                    },
                    phache: { // thongtinphache
                        ngayPhache: parseExcelDate(values[11]), heSoBu: values[12],
                        say1: values[13], THT1: values[14], vien1: values[15],
                        say2: values[16], THT2: values[17], vien2: values[18],
                        doCung: values[19], doRa: values[20], doMayMon: values[21],
                        ngayDongGoiCap1: parseExcelDate(values[22]), khoiLuongCom: values[23]
                    },
                    btp: { // BTPcom
                        KLV_yeucaudap: values[24], KLV_QC: values[25],
                        tapDon: values[26], tapKhac: values[27], tongTap: values[28]
                    },
                    dapvien: { // dapvien
                        KLV_yeucau: values[29], KLV_PKN: values[30],
                        dongDeuDonViLieu: values[31], ra: values[32],
                        tapDon: values[33], tapKhac: values[34], tongTap: values[35]
                    },
                    thanhpham: { // thanhpham
                        ngayKiem: parseExcelDate(values[36]), ngayDongGoiCap2: parseExcelDate(values[37]),
                        soLuongGiaoNop: values[38], loCF: values[39], KLV: values[40],
                        tapDon: values[41], tapKhac: values[42], tap4Amino: values[43],
                        tongTap: values[44], doMinLon: values[45], doMinNho: values[46],
                        soSaiLech: values[47], soKiemSoatThayDoi: values[48], ghiChu: values[49]
                    },
                    hoatchats: []
                };
            }

            // Hoạt chất (Dữ liệu con lặp lại)
            if (values[50]) { // Cột AX: Tên hoạt chất
                dataLots[soLo].hoatchats.push({
                    tenHoatChat: values[50],
                    BTP_dinhLuong: values[51],
                    dapVien_dinhLuong: values[52],
                    // Hòa tan dập viên S1
                    dapVien_hoatan1_vien1: values[53], dapVien_hoatan1_vien2: values[54],
                    dapVien_hoatan1_vien3: values[55], dapVien_hoatan1_vien4: values[56],
                    dapVien_hoatan1_vien5: values[57], dapVien_hoatan1_vien6: values[58],
                    // Hòa tan dập viên S2
                    dapVien_hoatan2_vien1: values[59], dapVien_hoatan2_vien2: values[60],
                    dapVien_hoatan2_vien3: values[61], dapVien_hoatan2_vien4: values[62],
                    dapVien_hoatan2_vien5: values[63], dapVien_hoatan2_vien6: values[64],
                    // Thông tin thành phẩm
                    thanhPham_dinhLuong: values[65],
                    thanhPham_doRa: values[66],
                    // Hòa tan thành phẩm S1
                    thanhPham_hoatan1_vien1: values[67], thanhPham_hoatan1_vien2: values[68],
                    thanhPham_hoatan1_vien3: values[69], thanhPham_hoatan1_vien4: values[70],
                    thanhPham_hoatan1_vien5: values[71], thanhPham_hoatan1_vien6: values[72],
                    // Hòa tan thành phẩm S2
                    thanhPham_hoatan2_vien1: values[73], thanhPham_hoatan2_vien2: values[74],
                    thanhPham_hoatan2_vien3: values[75], thanhPham_hoatan2_vien4: values[76],
                    thanhPham_hoatan2_vien5: values[77], thanhPham_hoatan2_vien6: values[78],
                    thanhPham_doAm: values[79],
                    DDDVL_TB: values[80], DDDVL_AV: values[81],
                    DDDVL_Vien1: values[82], DDDVL_Vien2: values[83], DDDVL_Vien3: values[84],
                    DDDVL_Vien4: values[85], DDDVL_Vien5: values[86], DDDVL_Vien6: values[87],
                    DDDVL_Vien7: values[88], DDDVL_Vien8: values[89], DDDVL_Vien9: values[90],
                    DDDVL_Vien10: values[91]
                });
            }
        });

        for (const soLo in dataLots) {
            const lotData = dataLots[soLo];
            const [lot] = await db.losanxuat.findOrCreate({
                where: { soLo }, defaults: lotData.info, transaction
            });
            await lot.update(lotData.info, { transaction });

            // Lưu các bảng con 1-1
            await db.thongtinphache.upsert({ ...lotData.phache, losanxuatId: lot.id }, { transaction });
            await db.BTPcom.upsert({ ...lotData.btp, losanxuatId: lot.id }, { transaction });
            await db.dapvien.upsert({ ...lotData.dapvien, losanxuatId: lot.id }, { transaction });
            await db.thanhpham.upsert({ ...lotData.thanhpham, losanxuatId: lot.id }, { transaction });

            // Lưu các hoạt chất
            for (const hc of lotData.hoatchats) {
                await db.hoatchatsanxuat.upsert({ ...hc, losanxuatId: lot.id }, { transaction });
            }
        }

        await transaction.commit();

        // Xóa file tạm sau khi xử lý xong
        if (req.file) fs.unlinkSync(req.file.path);

        req.flash('success', `Import thành công ${Object.keys(dataLots).length} lô sản xuất!`);
        res.redirect('/sanxuat/import-excel');
    } catch (e) {
        if (transaction) await transaction.rollback();
        if (req.file) fs.unlinkSync(req.file.path);
        console.error(e);
        req.flash('error', "Lỗi Import: " + e.message);
        res.redirect('/sanxuat/import-excel');
    }
};

const exportExcel_ImportTemplate = async (req, res, next) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Mẫu Import APQR');

        // 1. TIÊU ĐỀ LỚN (Hàng 1)
        worksheet.mergeCells('A1:CM1'); // Merge across all columns
        const titleRow = worksheet.getCell('A1');
        titleRow.value = 'MẪU IMPORT DỮ LIỆU APQR';
        titleRow.font = { name: 'Arial', size: 18, bold: true };
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 40;

        // 2. ĐỊNH NGHĨA TIÊU ĐỀ 2 TẦNG (Hàng 2 và Hàng 3)
        // Hàng 2: Các cột đơn lẻ và các nhóm lớn
        const row2Values = [
            'STT', // A
            'THÔNG TIN CHUNG', '', '', '', '', '', '', '', '', // B-J
            'THÔNG TIN PHA CHẾ', '', '', '', '', '', '', '', '', '', '', '', '', // K-W
            'BTP - CỐM', '', '', '', '', // X-AB
            'DẬP VIÊN', '', '', '', '', '', '', // AC-AI
            'THÀNH PHẨM', '', '', '', '', '', '', '', '', '', '', '', '', '', // AJ-AW
            'HOẠT CHẤT (Lặp lại cho mỗi hoạt chất)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', // AX-CM
        ];
        const row2 = worksheet.getRow(2);
        row2.values = row2Values;

        // Hàng 3: Các cột con bên dưới tiêu đề lớn
        const row3Values = [
            '', // A (STT)
            'Sản phẩm', // B
            'SĐK', // C
            'Dạng BC', // D
            'Quy cách ĐG', // E
            'Cỡ lô', // F
            'Số lô', // G
            'Thẩm định (x)', // H
            'Ghi chú lô', // I
            'Trạng thái', // J

            'Ngày pha chế', // K
            'Hệ số bù', // L
            'Sấy 1', // M
            'THT 1', // N
            'Viên 1', // O
            'Sấy 2', // P
            'THT 2', // Q
            'Viên 2', // R
            'Độ cứng', // S
            'Độ rã', // T
            'Độ mài mòn', // U
            'Ngày ĐG1', // V
            'KL Cốm', // W

            'KLV YC Dập', // X
            'KLV QC', // Y
            'Tạp Đơn', // Z
            'Tạp Khác', // AA
            'Tổng Tạp', // AB

            'KLV YC', // AC
            'KLV PKN', // AD
            'ĐĐĐVL', // AE
            'Rã', // AF
            'Tạp Đơn', // AG
            'Tạp Khác', // AH
            'Tổng Tạp', // AI

            'Ngày kiểm', // AJ
            'Ngày ĐG2', // AK
            'SL Giao Nộp', // AL
            'Lô CF', // AM
            'KLV TP', // AN
            'Tạp Đơn', // AO
            'Tạp Khác', // AP
            'Tạp 4-Amino', // AQ
            'Tổng Tạp', // AR
            'Độ mịn Lớn', // AS
            'Độ mịn Nhỏ', // AT
            'Số sai lệch', // AU
            'Số KS Thay đổi', // AV
            'Ghi chú TP', // AW

            'Tên Hoạt Chất', // AX
            'ĐL BTP', // AY
            'ĐL DV', // AZ
            'HT DV S1 V1', 'HT DV S1 V2', 'HT DV S1 V3', 'HT DV S1 V4', 'HT DV S1 V5', 'HT DV S1 V6', // BA-BF
            'HT DV S2 V1', 'HT DV S2 V2', 'HT DV S2 V3', 'HT DV S2 V4', 'HT DV S2 V5', 'HT DV S2 V6', // BG-BL
            'ĐL TP', // BM
            'Độ rã TP', // BN
            'HT TP S1 V1', 'HT TP S1 V2', 'HT TP S1 V3', 'HT TP S1 V4', 'HT TP S1 V5', 'HT TP S1 V6', // BO-BT
            'HT TP S2 V1', 'HT TP S2 V2', 'HT TP S2 V3', 'HT TP S2 V4', 'HT TP S2 V5', 'HT TP S2 V6', // BU-BZ
            'Độ ẩm TP', // CA
            'ĐĐĐVL TB', 'ĐĐĐVL AV', // CB-CC
            'ĐĐĐVL V1', 'ĐĐĐVL V2', 'ĐĐĐVL V3', 'ĐĐĐVL V4', 'ĐĐĐVL V5', 'ĐĐĐVL V6', 'ĐĐĐVL V7', 'ĐĐĐVL V8', 'ĐĐĐVL V9', 'ĐĐĐVL V10' // CD-CM
        ];
        const row3 = worksheet.getRow(3);
        row3.values = row3Values;

        // Thiết lập chiều cao cho hàng tiêu đề cột
        row2.height = 25;
        row3.height = 20;

        // 3. TIẾN HÀNH GỘP Ô TIÊU ĐỀ (MERGE CELLS)
        worksheet.mergeCells('A2:A3'); // STT
        worksheet.mergeCells('B2:J2'); // THÔNG TIN CHUNG
        worksheet.mergeCells('K2:W2'); // THÔNG TIN PHA CHẾ
        worksheet.mergeCells('X2:AB2'); // BTP - CỐM
        worksheet.mergeCells('AC2:AI2'); // DẬP VIÊN
        worksheet.mergeCells('AJ2:AW2'); // THÀNH PHẨM
        worksheet.mergeCells('AX2:CM2'); // HOẠT CHẤT

        // 4. ĐỊNH DẠNG STYLE CHO TIÊU ĐỀ (Border, Alignment, Font)
        const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        for (let r = 2; r <= 3; r++) {
            const row = worksheet.getRow(r);
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.font = { name: 'Arial', size: 10, bold: true };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = borderStyle;
            });
        }

        // 5. Cấu hình độ rộng các cột
        const colWidths = {
            A: 5, // STT
            B: 20, C: 15, D: 15, E: 15, F: 10, G: 15, H: 10, I: 20, J: 10, // THÔNG TIN CHUNG
            K: 15, L: 10, M: 10, N: 10, O: 10, P: 10, Q: 10, R: 10, S: 10, T: 10, U: 10, V: 15, W: 15, // THÔNG TIN PHA CHẾ
            X: 10, Y: 10, Z: 10, AA: 10, AB: 10, // BTP - CỐM
            AC: 10, AD: 10, AE: 10, AF: 10, AG: 10, AH: 10, AI: 10, // DẬP VIÊN
            AJ: 15, AK: 15, AL: 15, AM: 10, AN: 10, AO: 10, AP: 10, AQ: 10, AR: 10, AS: 10, AT: 10, AU: 10, AV: 10, AW: 20, // THÀNH PHẨM
            AX: 20, AY: 10, AZ: 10, BA: 8, BB: 8, BC: 8, BD: 8, BE: 8, BF: 8, BG: 8, BH: 8, BI: 8, BJ: 8, BK: 8, BL: 8, BM: 10, BN: 10, BO: 8, BP: 8, BQ: 8, BR: 8, BS: 8, BT: 8, BU: 8, BV: 8, BW: 8, BX: 8, BY: 8, BZ: 8, CA: 10, CB: 10, CC: 10, CD: 8, CE: 8, CF: 8, CG: 8, CH: 8, CI: 8, CJ: 8, CK: 8, CL: 8, CM: 8 // HOẠT CHẤT
        };
        Object.keys(colWidths).forEach(col => {
            worksheet.getColumn(col).width = colWidths[col];
        });

        // 6. Thêm một dòng ví dụ để hướng dẫn người dùng
        const exampleRowValues = [
            1, // STT
            'Sản phẩm A', 'SĐK-001', 'Viên nén', 'Hộp 10 vỉ x 10 viên', '100000', 'LOT-20240615-001', 'x', 'Ghi chú lô ví dụ', 'active',
            '2024-06-01', '5%', '2.5', '3.0', '100', '2.0', '2.8', '99', '80N', '5min', '0.1%', '2024-06-02', '200kg',
            '500', '502', '0.01', '0.02', '0.03',
            '500', '501', '98', '10min', '0.01', '0.015', '0.025',
            '2024-06-10', '2024-06-11', '99000', 'CF-001', '500.5', '0.005', '0.01', '0.002', '0.017', '95', '90', '0', 'No', 'Ghi chú TP ví dụ',
            'Hoạt chất X', '99.5', '100.2', '85', '87', '88', '84', '86', '89', '90', '91', '92', '93', '94', '95', '99.8', '12min', '90', '91', '92', '90', '91', '93', '95', '96', '97', '98', '99', '100', '2.1', '100.1', '5.2', '98', '99', '101', '100', '99', '102', '97', '98', '99', '100'
        ];
        const exampleRow = worksheet.addRow(exampleRowValues);
        exampleRow.height = 20;
        exampleRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = borderStyle;
            cell.font = { name: 'Arial', size: 10 };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        });

        // 7. TRẢ FILE VỀ CLIENT
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=mau_import_apqr.xlsx');
        res.send(buffer);
    } catch (e) {
        console.error("Lỗi khi tạo file Excel mẫu:", e);
        next(e);
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
            'HÒA TAN (Dập viên...)', '', '', '', '', '', '', '',
            'HÒA TAN (Thành phẩm)', '', '', '', '', '', '', '',
            'Độ ẩm',
            'Đồng đều đơn vị liều', '', '', '',
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
                    // item.BTPcom ? `${item.BTPcom.tlvMin || ''} - ${item.BTPcom.tlvMax || ''}` : '', // I: KLV (mg)
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
    importExcel_DanhSachSanPham,
    exportExcel_ImportTemplate
}