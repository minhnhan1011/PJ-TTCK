-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 07, 2026 at 01:17 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qlphongkham`
--
CREATE DATABASE IF NOT EXISTS `qlphongkham` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `qlphongkham`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `sp_LayBenhNhan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_LayBenhNhan` ()   BEGIN
    SELECT * FROM BenhNhan;
END$$

DROP PROCEDURE IF EXISTS `sp_ThemBenhNhan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ThemBenhNhan` (IN `p_hoten` VARCHAR(100), IN `p_ngaysinh` DATE, IN `p_gioitinh` VARCHAR(10), IN `p_diachi` VARCHAR(200), IN `p_sdt` VARCHAR(15))   BEGIN
    INSERT INTO BenhNhan(hoten, ngaysinh, gioitinh, diachi, sdt)
    VALUES (p_hoten, p_ngaysinh, p_gioitinh, p_diachi, p_sdt);
END$$

DROP PROCEDURE IF EXISTS `sp_XoaBenhNhan`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_XoaBenhNhan` (IN `p_id` INT)   BEGIN
    DELETE FROM BenhNhan WHERE mabn = p_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `benhnhan`
--

DROP TABLE IF EXISTS `benhnhan`;
CREATE TABLE IF NOT EXISTS `benhnhan` (
  `mabn` int NOT NULL AUTO_INCREMENT,
  `hoten` varchar(100) NOT NULL,
  `ngaysinh` date DEFAULT NULL,
  `gioitinh` varchar(10) DEFAULT NULL,
  `diachi` varchar(200) DEFAULT NULL,
  `sdt` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`mabn`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `benhnhan`
--

INSERT INTO `benhnhan` (`mabn`, `hoten`, `ngaysinh`, `gioitinh`, `diachi`, `sdt`) VALUES
(1, 'Nguyen Van A', '2000-01-01', 'Nam', 'HCM', '0123'),
(2, 'Tran Thi B', '1999-05-10', 'Nu', 'HN', '0456');

-- --------------------------------------------------------

--
-- Table structure for table `dangkykham`
--

DROP TABLE IF EXISTS `dangkykham`;
CREATE TABLE IF NOT EXISTS `dangkykham` (
  `madk` int NOT NULL AUTO_INCREMENT,
  `mabn` int DEFAULT NULL,
  `manv` int DEFAULT NULL,
  `stt` int DEFAULT NULL,
  `lydokham` varchar(255) DEFAULT NULL,
  `ngaydangky` datetime DEFAULT CURRENT_TIMESTAMP,
  `trangthai` varchar(50) DEFAULT 'Cho kham',
  PRIMARY KEY (`madk`),
  KEY `mabn` (`mabn`),
  KEY `manv` (`manv`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dangkykham`
--

INSERT INTO `dangkykham` (`madk`, `mabn`, `manv`, `stt`, `lydokham`, `ngaydangky`, `trangthai`) VALUES
(1, 1, 1, 1, 'Sot cao', '2026-04-05 01:27:59', 'Cho kham'),
(2, 2, 2, 2, 'Dau bung', '2026-04-05 01:27:59', 'Cho kham');

-- --------------------------------------------------------

--
-- Table structure for table `dichvu`
--

DROP TABLE IF EXISTS `dichvu`;
CREATE TABLE IF NOT EXISTS `dichvu` (
  `madv` int NOT NULL AUTO_INCREMENT,
  `tendv` varchar(100) NOT NULL,
  `gia` decimal(10,2) NOT NULL,
  `trangthai` varchar(50) DEFAULT 'Hoat dong',
  PRIMARY KEY (`madv`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dichvu`
--

INSERT INTO `dichvu` (`madv`, `tendv`, `gia`, `trangthai`) VALUES
(1, 'Xet nghiem mau', 200000.00, 'Hoat dong'),
(2, 'Sieu am', 300000.00, 'Hoat dong');

-- --------------------------------------------------------

--
-- Table structure for table `donthuoc`
--

DROP TABLE IF EXISTS `donthuoc`;
CREATE TABLE `donthuoc` (
  `madt` int NOT NULL AUTO_INCREMENT,
  `mapk` int DEFAULT NULL,
  PRIMARY KEY (`madt`),
  KEY `mapk` (`mapk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `donthuoc`
--

INSERT INTO `donthuoc` (`madt`, `mapk`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------
DROP TABLE IF EXISTS `chitiet_donthuoc`;
CREATE TABLE `chitiet_donthuoc` (
  `mact` int NOT NULL AUTO_INCREMENT,
  `madt` int NOT NULL,
  `mat` int NOT NULL,
  `soluong` int NOT NULL,
  `lieudung` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`mact`),
  KEY `madt` (`madt`),
  KEY `mat` (`mat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Chi tiết đơn thuốc
INSERT INTO `chitiet_donthuoc` (`madt`, `mat`, `soluong`, `lieudung`) VALUES
(1, 1, 10, 'Sau ăn'),
(2, 2, 7, 'Trước ăn');

--
-- Table structure for table `loaithuoc`
--

DROP TABLE IF EXISTS `loaithuoc`;
CREATE TABLE IF NOT EXISTS `loaithuoc` (
  `malt` int NOT NULL AUTO_INCREMENT,
  `tenlt` varchar(100) NOT NULL,
  PRIMARY KEY (`malt`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loaithuoc`
--

INSERT INTO `loaithuoc` (`malt`, `tenlt`) VALUES
(1, 'Khang sinh'),
(2, 'Giam dau');

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
CREATE TABLE IF NOT EXISTS `nhanvien` (
  `manv` int NOT NULL AUTO_INCREMENT,
  `hoten` varchar(100) NOT NULL,
  `chucvu` varchar(50) DEFAULT NULL,
  `sdt` varchar(15) DEFAULT NULL,
  `diachi` varchar(200) DEFAULT NULL,
  `trangthai` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`manv`),
  CONSTRAINT `chk_nhanvien_trangthai` CHECK (`trangthai` IN (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nhanvien`
--
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO `nhanvien` (`manv`, `hoten`, `chucvu`, `sdt`, `diachi`, `trangthai`) VALUES
(1, 'Bac si A', 'Bac si', '0909', 'HCM', 1),
(2, 'Bac si B', 'Bac si', '0908', 'HN', 1),
(3, 'Ky thuat vien C', 'Ky thuat vien', '0907', 'HCM', 1),
(4, 'Ke toan D', 'Ke toan', '0906', 'HN', 1),
(5, 'Tiep tan E', 'Le tan', '0911', 'HCM', 1),
(6, 'Duoc si F', 'Duoc si', '0922', 'HN', 1);

-- --------------------------------------------------------

--
-- Table structure for table `phieukham`
--

DROP TABLE IF EXISTS `phieukham`;
CREATE TABLE IF NOT EXISTS `phieukham` (
  `mapk` int NOT NULL AUTO_INCREMENT,
  `madk` int DEFAULT NULL,
  `manv` int DEFAULT NULL,
  `chuandoan` varchar(255) DEFAULT NULL,
  `ngaykham` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mapk`),
  UNIQUE KEY `madk` (`madk`),
  KEY `manv` (`manv`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `phieukham`
--

INSERT INTO `phieukham` (`mapk`, `madk`, `manv`, `chuandoan`, `ngaykham`) VALUES
(1, 1, 1, 'Cam cum', '2026-04-05 01:27:59'),
(2, 2, 2, 'Dau da day', '2026-04-05 01:27:59');

-- --------------------------------------------------------

--
-- Table structure for table `phieuthu`
--

-- --------------------------------------------------------
-- Sửa cấu trúc bảng phieuthu để nhận mã chuỗi và thêm ghi chú
-- --------------------------------------------------------
DROP TABLE IF EXISTS `phieuthu`;
CREATE TABLE IF NOT EXISTS `phieuthu` (
  `mapt` varchar(50) NOT NULL,          -- Đổi từ INT sang VARCHAR để chứa mã 'PT2026...'
  `mapk` int DEFAULT NULL,              -- Cho phép NULL để linh hoạt thanh toán
  `manv` int DEFAULT NULL,
  `tongtien` decimal(12,2) NOT NULL,
  `ngaythu` datetime DEFAULT CURRENT_TIMESTAMP,
  `trangthai` varchar(50) DEFAULT 'Da thanh toan',
  `ghichu` text DEFAULT NULL,           -- Thêm cột này để khớp với giao diện ReactJS
  PRIMARY KEY (`mapt`),                 -- Khóa chính bây giờ là chuỗi
  UNIQUE KEY `mapk` (`mapk`),
  KEY `manv` (`manv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `phieuthu`
--

-- Sửa lại định dạng ID từ số sang chuỗi
INSERT INTO `phieuthu` (`mapt`, `mapk`, `manv`, `tongtien`, `ngaythu`, `trangthai`, `ghichu`) VALUES
('PT202604050001', 1, 4, 200000.00, '2026-04-05 01:28:00', 'Da thanh toan', 'Thanh toán tiền khám'),
('PT202604050002', 2, 4, 300000.00, '2026-04-05 01:28:00', 'Da thanh toan', 'Thanh toán siêu âm');

-- --------------------------------------------------------

--
-- Table structure for table `phieuxetnghiem`
--

DROP TABLE IF EXISTS `phieuxetnghiem`;
CREATE TABLE IF NOT EXISTS `phieuxetnghiem` (
  `maxn` int NOT NULL AUTO_INCREMENT,
  `mapk` int DEFAULT NULL,
  `madv` int DEFAULT NULL,
  `ketqua` varchar(255) DEFAULT NULL,
  `trangthai` varchar(50) DEFAULT NULL,
  `manv` int DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `ngaythuchien` datetime DEFAULT NULL,
  `nguoiduyet` int DEFAULT NULL,
  PRIMARY KEY (`maxn`),
  KEY `mapk` (`mapk`),
  KEY `madv` (`madv`),
  KEY `manv` (`manv`),
  KEY `nguoiduyet` (`nguoiduyet`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `phieuxetnghiem`
--

INSERT INTO `phieuxetnghiem` (`maxn`, `mapk`, `madv`, `ketqua`, `trangthai`, `manv`, `file_url`, `ngaythuchien`, `nguoiduyet`) VALUES
(1, 1, 1, 'Binh thuong', 'Da xong', 3, NULL, '2026-04-05 01:27:59', 1),
(2, 2, 2, 'Co van de', 'Da xong', 3, NULL, '2026-04-05 01:27:59', 2);

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
CREATE TABLE IF NOT EXISTS `taikhoan` (
  `matk` int NOT NULL AUTO_INCREMENT,
  `tendn` varchar(50) NOT NULL,
  `matkhau` varchar(100) NOT NULL,
  `vaitro` varchar(50) NOT NULL,
  `manv` int DEFAULT NULL,
  `hoten` varchar(100) DEFAULT NULL, 
  `email` varchar(100) DEFAULT NULL,
  `sdt` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`matk`),
  UNIQUE KEY `tendn` (`tendn`),
  KEY `manv` (`manv`) 
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `taikhoan`
--
INSERT INTO `taikhoan` (`matk`, `tendn`, `matkhau`, `vaitro`, `manv`, `hoten`) VALUES 
(1, 'admin', '123', 'admin', 1, 'Admin Hệ Thống'),
(2, 'bacsi', '123', 'bacsi', 2, 'Bác sĩ A'),
(3, 'tieptan', '123', 'tieptan', 3, 'Tiếp tân C'),
(4, 'duocsi', '123', 'duocsi', 4, 'Dược sĩ D'),
(5, 'thungan', '123', 'thungan', 5, 'Thu ngân E'),
(6, 'ktv', '123', 'ktv', 6, 'Kỹ thuật viên F');

-- --------------------------------------------------------

--
-- Table structure for table `thuoc`
--

DROP TABLE IF EXISTS `thuoc`;
CREATE TABLE IF NOT EXISTS `thuoc` (
  `mat` int NOT NULL AUTO_INCREMENT,
  `tent` varchar(100) NOT NULL,
  `malt` int DEFAULT NULL,
  `dongia` decimal(10,2) NOT NULL,
  `ngaysanxuat` date DEFAULT NULL,
  `hansudung` date DEFAULT NULL,
  `trangthai` varchar(50) DEFAULT 'Con han',
  `soluong` int DEFAULT '0',
  `donvi` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`mat`),
  KEY `malt` (`malt`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `thuoc`
--

INSERT INTO `thuoc` (`mat`, `tent`, `malt`, `dongia`, `ngaysanxuat`, `hansudung`, `trangthai`, `soluong`, `donvi`) VALUES
(1, 'Paracetamol', 2, 5000.00, '2025-01-01', '2028-04-30', 'Con han', 50, 'Hộp'),
(2, 'Amoxicillin', 1, 10000.00, '2025-02-01', '2025-02-01', 'Con han', 6, 'Viên'),
(3, 'Paracetamol', 2, 60000000.00, '2026-04-05', '2027-04-15', 'Con han', 50, 'Vỉ');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dangkykham`
--
ALTER TABLE `dangkykham`
  ADD CONSTRAINT `dangkykham_ibfk_1` FOREIGN KEY (`mabn`) REFERENCES `benhnhan` (`mabn`),
  ADD CONSTRAINT `dangkykham_ibfk_2` FOREIGN KEY (`manv`) REFERENCES `nhanvien` (`manv`);

--
-- Constraints for table `donthuoc`
--
ALTER TABLE `donthuoc`
  ADD CONSTRAINT `donthuoc_ibfk_1`
  FOREIGN KEY (`mapk`) REFERENCES `phieukham`(`mapk`);

ALTER TABLE `chitiet_donthuoc`
  ADD CONSTRAINT `ctdt_ibfk_1`
  FOREIGN KEY (`madt`) REFERENCES `donthuoc`(`madt`) ON DELETE CASCADE,
  ADD CONSTRAINT `ctdt_ibfk_2`
  FOREIGN KEY (`mat`) REFERENCES `thuoc`(`mat`);

--
-- Constraints for table `phieukham`
--
ALTER TABLE `phieukham`
  ADD CONSTRAINT `phieukham_ibfk_1` FOREIGN KEY (`madk`) REFERENCES `dangkykham` (`madk`),
  ADD CONSTRAINT `phieukham_ibfk_2` FOREIGN KEY (`manv`) REFERENCES `nhanvien` (`manv`);

--
-- Constraints for table `phieuthu`
--
-- Constraints for table `phieuthu`
ALTER TABLE `phieuthu`
  ADD CONSTRAINT `phieuthu_ibfk_1` FOREIGN KEY (`mapk`) REFERENCES `phieukham` (`mapk`) ON DELETE SET NULL, 
  ADD CONSTRAINT `phieuthu_ibfk_2` FOREIGN KEY (`manv`) REFERENCES `nhanvien` (`manv`);
--
-- Constraints for table `phieuxetnghiem`
--
ALTER TABLE `phieuxetnghiem`
  ADD CONSTRAINT `phieuxetnghiem_ibfk_1` FOREIGN KEY (`mapk`) REFERENCES `phieukham` (`mapk`),
  ADD CONSTRAINT `phieuxetnghiem_ibfk_2` FOREIGN KEY (`madv`) REFERENCES `dichvu` (`madv`),
  ADD CONSTRAINT `phieuxetnghiem_ibfk_3` FOREIGN KEY (`manv`) REFERENCES `nhanvien` (`manv`),
  ADD CONSTRAINT `phieuxetnghiem_ibfk_4` FOREIGN KEY (`nguoiduyet`) REFERENCES `nhanvien` (`manv`);

--
-- Constraints for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`manv`) REFERENCES `nhanvien` (`manv`);

--
-- Constraints for table `thuoc`
--
ALTER TABLE `thuoc`
  ADD CONSTRAINT `thuoc_ibfk_1` FOREIGN KEY (`malt`) REFERENCES `loaithuoc` (`malt`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
