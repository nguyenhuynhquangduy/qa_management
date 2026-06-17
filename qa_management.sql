-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 16, 2026 lúc 06:27 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qa_management`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `btpcoms`
--

CREATE TABLE `btpcoms` (
  `id` int(11) NOT NULL,
  `losanxuatId` int(11) NOT NULL,
  `KLV_yeucaudap` varchar(255) DEFAULT NULL,
  `KLV_QC` varchar(255) DEFAULT NULL,
  `tapDon` varchar(255) DEFAULT NULL,
  `tapKhac` varchar(255) DEFAULT NULL,
  `tongTap` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dapviens`
--

CREATE TABLE `dapviens` (
  `id` int(11) NOT NULL,
  `losanxuatId` int(11) NOT NULL,
  `KLV_yeucau` varchar(255) DEFAULT NULL,
  `KLV_PKN` varchar(255) DEFAULT NULL,
  `dongDeuDonViLieu` varchar(255) DEFAULT NULL,
  `ra` varchar(255) DEFAULT NULL,
  `tapDon` varchar(255) DEFAULT NULL,
  `tapKhac` varchar(255) DEFAULT NULL,
  `tongTap` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dm_hoatchats`
--

CREATE TABLE `dm_hoatchats` (
  `id` int(11) NOT NULL,
  `tenHoatChat` varchar(255) DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dm_sanphams`
--

CREATE TABLE `dm_sanphams` (
  `id` int(11) NOT NULL,
  `tenSanPham` varchar(255) DEFAULT NULL,
  `soDangKy` varchar(255) DEFAULT NULL,
  `dangBaoChe` varchar(255) DEFAULT NULL,
  `quyCachDongGoi` varchar(255) DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dm_sanpham_hoatchats`
--

CREATE TABLE `dm_sanpham_hoatchats` (
  `id` int(11) NOT NULL,
  `idDmSanPham` int(11) DEFAULT NULL,
  `tenHoatChat` varchar(255) DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoatchatsanxuats`
--

CREATE TABLE `hoatchatsanxuats` (
  `id` int(11) NOT NULL,
  `losanxuatId` int(11) NOT NULL,
  `tenHoatChat` varchar(255) DEFAULT NULL,
  `BTP_dinhLuong` decimal(5,2) DEFAULT NULL,
  `dapVien_dinhLuong` decimal(5,2) DEFAULT NULL,
  `dapVien_hoatan1` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2` varchar(255) DEFAULT NULL,
  `thanhPham_dinhLuong` decimal(5,2) DEFAULT NULL,
  `thanhPham_doRa` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien1` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien2` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien3` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien4` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien5` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan1_vien6` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien1` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien2` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien3` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien4` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien5` varchar(255) DEFAULT NULL,
  `thanhPham_hoatan2_vien6` varchar(255) DEFAULT NULL,
  `thanhPham_doAm` varchar(255) DEFAULT NULL,
  `DDDVL_TB` varchar(255) DEFAULT NULL,
  `DDDVL_AV` varchar(255) DEFAULT NULL,
  `DDDVL_Vien1` varchar(255) DEFAULT NULL,
  `DDDVL_Vien2` varchar(255) DEFAULT NULL,
  `DDDVL_Vien3` varchar(255) DEFAULT NULL,
  `DDDVL_Vien4` varchar(255) DEFAULT NULL,
  `DDDVL_Vien5` varchar(255) DEFAULT NULL,
  `DDDVL_Vien6` varchar(255) DEFAULT NULL,
  `DDDVL_Vien7` varchar(255) DEFAULT NULL,
  `DDDVL_Vien8` varchar(255) DEFAULT NULL,
  `DDDVL_Vien9` varchar(255) DEFAULT NULL,
  `DDDVL_Vien10` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `dapVien_hoatan1_vien1` varchar(255) DEFAULT NULL,
  `dapVien_hoatan1_vien2` varchar(255) DEFAULT NULL,
  `dapVien_hoatan1_vien3` varchar(255) DEFAULT NULL,
  `dapVien_hoatan1_vien4` varchar(255) DEFAULT NULL,
  `dapVien_hoatan1_vien5` varchar(255) DEFAULT NULL,
  `dapVien_hoatan1_vien6` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien1` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien2` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien3` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien4` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien5` varchar(255) DEFAULT NULL,
  `dapVien_hoatan2_vien6` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `import_histories`
--

CREATE TABLE `import_histories` (
  `id` int(11) NOT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `tongDong` varchar(255) DEFAULT NULL,
  `thanhCong` varchar(255) DEFAULT NULL,
  `thatBai` varchar(255) DEFAULT NULL,
  `nguoiThucHien` varchar(255) DEFAULT NULL,
  `thoiGian` datetime DEFAULT NULL,
  `logLoi` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `MATK` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `additionalInfo` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `losanxuats`
--

CREATE TABLE `losanxuats` (
  `id` int(11) NOT NULL,
  `soLo` varchar(255) DEFAULT NULL,
  `thamDinh` tinyint(1) DEFAULT NULL,
  `tenSanPham` varchar(255) DEFAULT NULL,
  `soDangKy` varchar(255) DEFAULT NULL,
  `dangBaoChe` varchar(255) DEFAULT NULL,
  `quyCachDongGoi` varchar(255) DEFAULT NULL,
  `coLo` varchar(255) DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `isDelete` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhomquyens`
--

CREATE TABLE `nhomquyens` (
  `MANQ` int(11) NOT NULL,
  `TenNQ` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phanquyens`
--

CREATE TABLE `phanquyens` (
  `id` int(11) NOT NULL,
  `tenquyen` varchar(255) DEFAULT NULL,
  `MANQ` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoans`
--

CREATE TABLE `taikhoans` (
  `MATK` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `passwordEmail` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'active',
  `admin` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan_phanquyens`
--

CREATE TABLE `taikhoan_phanquyens` (
  `MATK` int(11) NOT NULL,
  `phanquyenId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanhphams`
--

CREATE TABLE `thanhphams` (
  `id` int(11) NOT NULL,
  `losanxuatId` int(11) NOT NULL,
  `ngayKiem` datetime DEFAULT NULL,
  `ngayDongGoiCap2` date DEFAULT NULL,
  `loCF` varchar(255) DEFAULT NULL,
  `KLV` varchar(255) DEFAULT NULL,
  `tapDon` varchar(255) DEFAULT NULL,
  `tapKhac` varchar(255) DEFAULT NULL,
  `tap4Amino` varchar(255) DEFAULT NULL,
  `tongTap` varchar(255) DEFAULT NULL,
  `doMinLon` varchar(255) DEFAULT NULL,
  `doMinNho` varchar(255) DEFAULT NULL,
  `soSaiLech` varchar(255) DEFAULT NULL,
  `soKiemSoatThayDoi` varchar(255) DEFAULT NULL,
  `ghiChu` varchar(255) DEFAULT NULL,
  `soLuongGiaoNop` int(12) DEFAULT NULL,
  `nguoiThucHien` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongtinphaches`
--

CREATE TABLE `thongtinphaches` (
  `id` int(11) NOT NULL,
  `losanxuatId` int(11) NOT NULL,
  `ngayPhache` datetime DEFAULT NULL,
  `heSoBu` varchar(255) DEFAULT NULL,
  `say1` varchar(255) DEFAULT NULL,
  `THT1` varchar(255) DEFAULT NULL,
  `vien1` varchar(255) DEFAULT NULL,
  `say2` varchar(255) DEFAULT NULL,
  `THT2` varchar(255) DEFAULT NULL,
  `vien2` varchar(255) DEFAULT NULL,
  `doCung` varchar(255) DEFAULT NULL,
  `doRa` varchar(255) DEFAULT NULL,
  `doMayMon` varchar(255) DEFAULT NULL,
  `ngayDongGoiCap1` datetime DEFAULT NULL,
  `khoiLuongCom` varchar(255) DEFAULT NULL,
  `khoiLuongGiaoNop` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_logs`
--

CREATE TABLE `user_logs` (
  `id` int(11) NOT NULL,
  `MATK` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `logs` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `btpcoms`
--
ALTER TABLE `btpcoms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `losanxuatId` (`losanxuatId`);

--
-- Chỉ mục cho bảng `dapviens`
--
ALTER TABLE `dapviens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `losanxuatId` (`losanxuatId`);

--
-- Chỉ mục cho bảng `dm_hoatchats`
--
ALTER TABLE `dm_hoatchats`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `dm_sanphams`
--
ALTER TABLE `dm_sanphams`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `dm_sanpham_hoatchats`
--
ALTER TABLE `dm_sanpham_hoatchats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idDmSanPham` (`idDmSanPham`);

--
-- Chỉ mục cho bảng `hoatchatsanxuats`
--
ALTER TABLE `hoatchatsanxuats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `losanxuatId` (`losanxuatId`);

--
-- Chỉ mục cho bảng `import_histories`
--
ALTER TABLE `import_histories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MATK` (`MATK`);

--
-- Chỉ mục cho bảng `losanxuats`
--
ALTER TABLE `losanxuats`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nhomquyens`
--
ALTER TABLE `nhomquyens`
  ADD PRIMARY KEY (`MANQ`);

--
-- Chỉ mục cho bảng `phanquyens`
--
ALTER TABLE `phanquyens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MANQ` (`MANQ`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `taikhoans`
--
ALTER TABLE `taikhoans`
  ADD PRIMARY KEY (`MATK`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `taikhoan_phanquyens`
--
ALTER TABLE `taikhoan_phanquyens`
  ADD PRIMARY KEY (`MATK`,`phanquyenId`),
  ADD UNIQUE KEY `taikhoan_phanquyens_MATK_phanquyenId_unique` (`MATK`,`phanquyenId`),
  ADD KEY `phanquyenId` (`phanquyenId`);

--
-- Chỉ mục cho bảng `thanhphams`
--
ALTER TABLE `thanhphams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `losanxuatId` (`losanxuatId`);

--
-- Chỉ mục cho bảng `thongtinphaches`
--
ALTER TABLE `thongtinphaches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `losanxuatId` (`losanxuatId`);

--
-- Chỉ mục cho bảng `user_logs`
--
ALTER TABLE `user_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MATK` (`MATK`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `btpcoms`
--
ALTER TABLE `btpcoms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `dapviens`
--
ALTER TABLE `dapviens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `dm_hoatchats`
--
ALTER TABLE `dm_hoatchats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `dm_sanphams`
--
ALTER TABLE `dm_sanphams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `dm_sanpham_hoatchats`
--
ALTER TABLE `dm_sanpham_hoatchats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoatchatsanxuats`
--
ALTER TABLE `hoatchatsanxuats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `import_histories`
--
ALTER TABLE `import_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `losanxuats`
--
ALTER TABLE `losanxuats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nhomquyens`
--
ALTER TABLE `nhomquyens`
  MODIFY `MANQ` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phanquyens`
--
ALTER TABLE `phanquyens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `taikhoans`
--
ALTER TABLE `taikhoans`
  MODIFY `MATK` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thanhphams`
--
ALTER TABLE `thanhphams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thongtinphaches`
--
ALTER TABLE `thongtinphaches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `user_logs`
--
ALTER TABLE `user_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `btpcoms`
--
ALTER TABLE `btpcoms`
  ADD CONSTRAINT `btpcoms_ibfk_1` FOREIGN KEY (`losanxuatId`) REFERENCES `losanxuats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dapviens`
--
ALTER TABLE `dapviens`
  ADD CONSTRAINT `dapviens_ibfk_1` FOREIGN KEY (`losanxuatId`) REFERENCES `losanxuats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dm_sanpham_hoatchats`
--
ALTER TABLE `dm_sanpham_hoatchats`
  ADD CONSTRAINT `dm_sanpham_hoatchats_ibfk_1` FOREIGN KEY (`idDmSanPham`) REFERENCES `dm_sanphams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hoatchatsanxuats`
--
ALTER TABLE `hoatchatsanxuats`
  ADD CONSTRAINT `hoatchatsanxuats_ibfk_1` FOREIGN KEY (`losanxuatId`) REFERENCES `losanxuats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`MATK`) REFERENCES `taikhoans` (`MATK`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phanquyens`
--
ALTER TABLE `phanquyens`
  ADD CONSTRAINT `phanquyens_ibfk_1` FOREIGN KEY (`MANQ`) REFERENCES `nhomquyens` (`MANQ`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `taikhoan_phanquyens`
--
ALTER TABLE `taikhoan_phanquyens`
  ADD CONSTRAINT `taikhoan_phanquyens_ibfk_1` FOREIGN KEY (`MATK`) REFERENCES `taikhoans` (`MATK`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `taikhoan_phanquyens_ibfk_2` FOREIGN KEY (`phanquyenId`) REFERENCES `phanquyens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `thanhphams`
--
ALTER TABLE `thanhphams`
  ADD CONSTRAINT `thanhphams_ibfk_1` FOREIGN KEY (`losanxuatId`) REFERENCES `losanxuats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `thongtinphaches`
--
ALTER TABLE `thongtinphaches`
  ADD CONSTRAINT `thongtinphaches_ibfk_1` FOREIGN KEY (`losanxuatId`) REFERENCES `losanxuats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user_logs`
--
ALTER TABLE `user_logs`
  ADD CONSTRAINT `user_logs_ibfk_1` FOREIGN KEY (`MATK`) REFERENCES `taikhoans` (`MATK`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
