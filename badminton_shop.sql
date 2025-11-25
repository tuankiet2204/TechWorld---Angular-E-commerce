-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 18, 2025 at 03:53 PM
-- Server version: 9.0.1
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `badminton_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `author_id` bigint UNSIGNED NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `origin_country` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `origin_country`) VALUES
(1, 'Yonex', 'yonex', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Yonex_Logo.svg/2560px-Yonex_Logo.svg.png', 'Nhật Bản'),
(2, 'Lining', 'lining', 'https://upload.wikimedia.org/wikipedia/commons/8/82/Li-Ning_logo.svg', 'Trung Quốc'),
(3, 'Victor', 'victor', 'https://upload.wikimedia.org/wikipedia/vi/2/22/Victor_logo.jpg', 'Đài Loan'),
(4, 'Mizuno', 'mizuno', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mizuno_logo.svg/2560px-Mizuno_logo.svg.png', 'Nhật Bản'),
(5, 'Kumpoo', 'kumpoo', 'https://cdn.shopvnb.com/img/400/logo-kumpoo.png', 'Trung Quốc'),
(6, 'Kawasaki', 'kawasaki', 'https://cdn.shopvnb.com/img/400/logo-kawasaki.png', 'Nhật Bản');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `parent_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `parent_id`) VALUES
(1, 'Vợt Cầu Lông', 'vot-cau-long', NULL),
(2, 'Giày Cầu Lông', 'giay-cau-long', NULL),
(3, 'Balo & Túi Vợt', 'balo-tui-vot', NULL),
(4, 'Phụ Kiện', 'phu-kien', NULL),
(5, 'Cước Cầu Lông', 'cuoc-cau-long', 4),
(6, 'Quấn Cán', 'quan-can', 4),
(7, 'Quần Áo', 'quan-ao', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `discount_type` enum('percent','fixed') NOT NULL,
  `discount_value` decimal(12,2) NOT NULL,
  `min_order_value` decimal(12,2) DEFAULT '0.00',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `usage_limit` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `shipping_name` varchar(100) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `shipping_address` text NOT NULL,
  `payment_method` enum('cod','banking','momo','vnpay') DEFAULT 'cod',
  `payment_status` enum('unpaid','paid','refunded') DEFAULT 'unpaid',
  `shipping_fee` decimal(12,2) DEFAULT '0.00',
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('pending','confirmed','processing','shipping','completed','cancelled') DEFAULT 'pending',
  `note` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `shipping_name`, `shipping_phone`, `shipping_address`, `payment_method`, `payment_status`, `shipping_fee`, `discount_amount`, `total_amount`, `status`, `note`, `created_at`) VALUES
(1, 'ORD-2024-001', 2, 'Nguyễn Văn A', '0918123456', '123 Cầu Giấy', 'cod', 'unpaid', 0.00, 0.00, 3360000.00, 'pending', NULL, '2025-11-18 22:51:09');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_variant_id` bigint UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_name` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `services_options` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_variant_id`, `product_name`, `variant_name`, `quantity`, `price`, `services_options`) VALUES
(1, 1, 3, 'Vợt Yonex Astrox 77 Pro', '4U / G5', 1, 3200000.00, '{\"tension\": \"11 kg\", \"is_strung\": true, \"technique\": \"4 nút\", \"string_name\": \"Yonex BG65 Ti\"}'),
(2, 1, 126, 'Cước Yonex BG65 Ti', 'Màu Trắng', 1, 160000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku_code` varchar(50) DEFAULT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `brand_id` int UNSIGNED DEFAULT NULL,
  `price_min` decimal(12,2) NOT NULL,
  `price_max` decimal(12,2) NOT NULL,
  `specifications` json DEFAULT NULL,
  `description` text,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `sku_code`, `category_id`, `brand_id`, `price_min`, `price_max`, `specifications`, `description`, `thumbnail_url`, `is_active`, `created_at`) VALUES
(1, 'Vợt Yonex Astrox 100ZZ Kurenai', 'yonex-astrox-100zz-kurenai', 'AX100ZZ', 1, 1, 3850000.00, 4000000.00, '{\"flex\": \"Siêu cứng\", \"balance\": \"Rất nặng đầu\", \"material\": \"Namd / Tungsten\", \"max_tension\": \"29 lbs\"}', '<p>Siêu phẩm tấn công của Viktor Axelsen.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-astrox-100zz-kurenai-do-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(2, 'Vợt Yonex Astrox 88D Pro Gen 3', 'yonex-astrox-88d-pro-gen3', 'AX88D-PRO', 1, 1, 3500000.00, 3700000.00, '{\"flex\": \"Cứng\", \"tech\": \"RGS\", \"balance\": \"Nặng đầu\", \"max_tension\": \"29 lbs\"}', '<p>Ông vua đánh đôi cầu sau.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-astrox-88d-pro-2024-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(3, 'Vợt Yonex Astrox 77 Pro', 'yonex-astrox-77-pro', 'AX77-PRO', 1, 1, 3200000.00, 3400000.00, '{\"flex\": \"Trung bình\", \"balance\": \"Nặng đầu\", \"max_tension\": \"28 lbs\"}', '<p>Vợt quốc dân, dễ thuần.</p>', 'https://cdn.shopvnb.com/img/400/yonex-astrox-77-pro-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(4, 'Vợt Yonex Nanoflare 1000Z', 'yonex-nanoflare-1000z', 'NF1000Z', 1, 1, 3900000.00, 4100000.00, '{\"flex\": \"Siêu cứng\", \"balance\": \"Nhẹ đầu\", \"max_tension\": \"29 lbs\"}', '<p>Kỷ lục Smash nhanh nhất thế giới.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-nanoflare-1000z-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(5, 'Vợt Yonex Nanoflare 800 Pro', 'yonex-nanoflare-800-pro', 'NF800-PRO', 1, 1, 3600000.00, 3800000.00, '{\"flex\": \"Cứng\", \"balance\": \"Nhẹ đầu\", \"max_tension\": \"28 lbs\"}', '<p>Chuyên phản tạt tốc độ cao.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-nanoflare-800-pro-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(6, 'Vợt Yonex Arcsaber 11 Pro', 'yonex-arcsaber-11-pro', 'ARC11-PRO', 1, 1, 3600000.00, 3800000.00, '{\"flex\": \"Cứng\", \"balance\": \"Cân bằng\", \"max_tension\": \"28 lbs\"}', '<p>Huyền thoại điều cầu.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-arcsaber-11-pro-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(7, 'Vợt Yonex Arcsaber 7 Pro', 'yonex-arcsaber-7-pro', 'ARC7-PRO', 1, 1, 3400000.00, 3600000.00, '{\"flex\": \"Trung bình\", \"balance\": \"Cân bằng\", \"max_tension\": \"27 lbs\"}', '<p>Kiểm soát cầu hoàn hảo.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-arcsaber-7-pro-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(8, 'Vợt Lining Axforce 100', 'lining-axforce-100', 'AX100', 1, 2, 4200000.00, 4500000.00, '{\"flex\": \"Cứng\", \"balance\": \"Nặng đầu\", \"max_tension\": \"31 lbs\"}', '<p>Đũa siêu nhỏ 6.0mm.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-lining-axforce-100-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(9, 'Vợt Lining Axforce 90 Max Tiger', 'lining-axforce-90-tiger', 'AX90-TIGER', 1, 2, 3900000.00, 4100000.00, '{\"flex\": \"Cứng\", \"balance\": \"Nặng đầu\", \"max_tension\": \"30 lbs\"}', '<p>Phiên bản Hổ quyền uy.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-lining-axforce-90-max-do-tiger-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(10, 'Vợt Lining Axforce 80', 'lining-axforce-80', 'AX80', 1, 2, 3800000.00, 4000000.00, '{\"flex\": \"Cứng\", \"balance\": \"Nặng đầu\", \"max_tension\": \"30 lbs\"}', '<p>Vợt của Chen Long.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-lining-axforce-80-chinh-hang-1.jpg', 1, '2025-11-18 22:51:09'),
(11, 'Vợt Lining Halbertec 8000', 'lining-halbertec-8000', 'HB8000', 1, 2, 3800000.00, 4000000.00, '{\"flex\": \"Trung bình cứng\", \"balance\": \"Cân bằng\", \"max_tension\": \"30 lbs\"}', '<p>Toàn diện công thủ.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-lining-halbertec-8000-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(12, 'Vợt Victor Ryuga II', 'victor-ryuga-2', 'RYUGA2', 1, 3, 3100000.00, 3300000.00, '{\"flex\": \"Trung bình cứng\", \"tech\": \"WES 2.0\", \"balance\": \"Nặng đầu\"}', '<p>Vợt Lee Zii Jia.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-victor-ryuga-2-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(13, 'Vợt Victor Thruster F Enhanced', 'victor-tk-f', 'TK-F', 1, 3, 3200000.00, 3400000.00, '{\"flex\": \"Cứng\", \"tech\": \"Anti-Torsion\", \"balance\": \"Nặng đầu\"}', '<p>Vợt Tai Tzu Ying.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-victor-thruster-k-f-den-ma-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(14, 'Vợt Mizuno Fortius 11 Quick', 'mizuno-fortius-11q', 'FT11Q', 1, 4, 3600000.00, 3800000.00, '{\"flex\": \"Cứng\", \"tech\": \"Torque\", \"balance\": \"Nặng đầu\"}', '<p>Tốc độ cao.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-mizuno-fortius-11-quick-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(15, 'Vợt Kumpoo PC-99 Pro', 'kumpoo-pc99-pro', 'PC99PRO', 1, 5, 850000.00, 950000.00, '{\"flex\": \"Trung bình\", \"balance\": \"Cân bằng\", \"material\": \"Graphite\"}', '<p>Vợt giá rẻ quốc dân.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-kumpoo-power-control-k520-pro-trang-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(16, 'Vợt Kawasaki Passion P23', 'kawasaki-p23', 'P23', 1, 6, 750000.00, 850000.00, '{\"flex\": \"Dẻo\", \"balance\": \"Nặng đầu\", \"max_tension\": \"28 lbs\"}', '<p>Màu sắc bắt mắt.</p>', 'https://cdn.shopvnb.com/img/400/vot-cau-long-kawasaki-passion-p23-do-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(17, 'Giày Yonex 65Z3 White Tiger', 'yonex-65z3-white-tiger', 'SHB65Z3-WT', 2, 1, 2500000.00, 2700000.00, '{\"fit\": \"Standard\", \"tech\": \"Power Cushion+\"}', '<p>Giày bán chạy nhất.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-65z3-trang-bach-ho-se-2024-noi-dia-nhat.jpg', 1, '2025-11-18 22:51:09'),
(18, 'Giày Yonex 65Z3 Black', 'yonex-65z3-black', 'SHB65Z3-BK', 2, 1, 2400000.00, 2600000.00, '{\"fit\": \"Standard\", \"tech\": \"Power Cushion+\"}', '<p>Màu đen mạnh mẽ.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-65z3-den-2022-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(19, 'Giày Yonex Aerus Z2 Blue', 'yonex-aerus-z2-blue', 'SHBAZ2-BL', 2, 1, 2600000.00, 2800000.00, '{\"tech\": \"Feather Bounce Foam\", \"weight\": \"250g\"}', '<p>Giày siêu nhẹ.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-aerus-z2-men-xanh-duong-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(20, 'Giày Yonex Eclipsion Z3', 'yonex-eclipsion-z3', 'SHBELZ3', 2, 1, 2800000.00, 3000000.00, '{\"tech\": \"Stability\"}', '<p>Ổn định cổ chân tốt nhất.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-eclipsion-z3-den-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(21, 'Giày Lining Halbertec AYAT003', 'lining-ayat003', 'AYAT003', 2, 2, 2300000.00, 2500000.00, '{\"tech\": \"Boom Tech\"}', '<p>Đế Boom siêu êm.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-lining-ayat003-2-trang-den-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(22, 'Giày Lining Saga Lite 7', 'lining-saga-lite-7', 'SAGALITE7', 2, 2, 1100000.00, 1200000.00, '{\"tech\": \"Thoáng khí\"}', '<p>Giày tầm trung bền bỉ.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-lining-saga-lite-7-trang-xanh-duong-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(23, 'Giày Victor P9200 III', 'victor-p9200-iii', 'P9200III', 2, 3, 2400000.00, 2600000.00, '{\"tech\": \"Energymax 3.0\"}', '<p>Giày huyền thoại Victor.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-victor-p9200-iii-55-trang-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(24, 'Giày Victor A970 Ace', 'victor-a970-ace', 'A970ACE', 2, 3, 2300000.00, 2500000.00, '{\"tech\": \"All-around\"}', '<p>Giày của Lee Zii Jia.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-victor-a970ace-den-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(25, 'Giày Mizuno Wave Claw 2', 'mizuno-wave-claw-2', 'WAVECLAW2', 2, 4, 2200000.00, 2400000.00, '{\"tech\": \"Mizuno Wave\"}', '<p>Form bè ngang thoải mái.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-mizuno-wave-claw-2-trang-xanh-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(26, 'Giày Kawasaki 173', 'kawasaki-173', 'K173', 2, 6, 850000.00, 950000.00, '{\"tech\": \"Non-marking\"}', '<p>Đế kếp siêu bền.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-kawasaki-173-trang-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(27, 'Giày Kumpoo KH-D82', 'kumpoo-kh-d82', 'KHD82', 2, 5, 650000.00, 750000.00, '{\"tech\": \"Basic\"}', '<p>Giày giá rẻ cho người mới.</p>', 'https://cdn.shopvnb.com/img/400/giay-cau-long-kumpoo-kh-e13-trang-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(28, 'Cước Yonex BG65 Ti', 'yonex-bg65-ti', 'BG65TI', 5, 1, 150000.00, 150000.00, '{\"gauge\": \"0.70mm\", \"durability\": \"High\"}', '<p>Cước bền tiếng nổ to.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-yonex-bg-65-ti-chinh-hang-2022.jpg', 1, '2025-11-18 22:51:09'),
(29, 'Cước Yonex BG66 Ultimax', 'yonex-bg66-ultimax', 'BG66UM', 5, 1, 170000.00, 170000.00, '{\"gauge\": \"0.65mm\", \"repulsion\": \"High\"}', '<p>Trợ lực tốt nhất.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-yonex-bg-66-ultimax-new-2021-xanh-ngoc.jpg', 1, '2025-11-18 22:51:09'),
(30, 'Cước Yonex Exbolt 63', 'yonex-exbolt-63', 'EXBOLT63', 5, 1, 180000.00, 180000.00, '{\"gauge\": \"0.63mm\", \"durability\": \"Medium\"}', '<p>Siêu mảnh siêu nảy.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-yonex-exbolt-63-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(31, 'Cước Yonex Exbolt 65', 'yonex-exbolt-65', 'EXBOLT65', 5, 1, 180000.00, 180000.00, '{\"gauge\": \"0.65mm\", \"durability\": \"High\"}', '<p>Nảy và bền hơn BG66.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-yonex-exbolt-65-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(32, 'Cước Lining No.1', 'lining-no1', 'NO1', 5, 2, 160000.00, 160000.00, '{\"gauge\": \"0.65mm\", \"sound\": \"High\"}', '<p>Cước nảy nhất Lining.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-cau-long-lining-no-1-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(33, 'Cước Victor VBS-66 Nano', 'victor-vbs-66', 'VBS66', 5, 3, 155000.00, 155000.00, '{\"tech\": \"Nano\", \"gauge\": \"0.66mm\"}', '<p>Cân bằng bền và nảy.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-victor-vbs-66-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(34, 'Cước Kizuna Z69', 'kizuna-z69', 'Z69', 5, 6, 140000.00, 140000.00, '{\"gauge\": \"0.69mm\", \"durability\": \"Super High\"}', '<p>Siêu bền từ Nhật Bản.</p>', 'https://cdn.shopvnb.com/img/400/cuoc-cang-vot-kizuna-z69-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(35, 'Balo Yonex 229BP', 'balo-yonex-229bp', 'BAG229BP', 3, 1, 850000.00, 850000.00, '{\"material\": \"Polyester\"}', '<p>Balo gọn nhẹ.</p>', 'https://cdn.shopvnb.com/img/400/balo-cau-long-yonex-bag229bp-den-gia-cong-2.jpg', 1, '2025-11-18 22:51:09'),
(36, 'Bao Vợt Lining 9 Ngăn', 'bao-vot-lining-9', 'ABJT055', 3, 2, 1200000.00, 1200000.00, '{\"capacity\": \"6-8 vợt\"}', '<p>Bao vợt thi đấu.</p>', 'https://cdn.shopvnb.com/img/400/tui-vot-cau-long-lining-abju009-1-trang-den-noi-dia.jpg', 1, '2025-11-18 22:51:09'),
(37, 'Bao Vợt Victor 2 Ngăn', 'bao-vot-victor-2', 'BR9609', 3, 3, 950000.00, 950000.00, '{\"capacity\": \"4-6 vợt\"}', '<p>Bao vợt chữ nhật thời trang.</p>', 'https://cdn.shopvnb.com/img/400/bao-vot-cau-long-victor-br9609-den-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(38, 'Quấn Cán Yonex AC102EX', 'quan-can-yonex-ac102ex', 'AC102EX', 6, 1, 150000.00, 150000.00, '{\"qty\": \"3pcs\"}', '<p>Quấn cán tốt nhất.</p>', 'https://cdn.shopvnb.com/img/400/quan-can-yonex-3-in-1-ac102ex-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(39, 'Quấn Cán Vải VS', 'quan-can-vai-vs', 'VS-VAI', 6, 5, 20000.00, 20000.00, '{\"type\": \"Towel\"}', '<p>Thấm hút mồ hôi tốt.</p>', 'https://cdn.shopvnb.com/img/400/quan-can-vai-vs-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(40, 'Băng Chặn Mồ Hôi Yonex', 'bang-chan-yonex', 'AC489', 4, 1, 80000.00, 80000.00, '{\"material\": \"Cotton\"}', '<p>Chặn mồ hôi tay.</p>', 'https://cdn.shopvnb.com/img/400/bang-chan-mo-hoi-yonex-ac489-den-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(41, 'Tất Yonex 3D', 'tat-yonex-3d', 'SOCK3D', 7, 1, 120000.00, 120000.00, '{\"tech\": \"Anti-slip\"}', '<p>Tất dày chống trượt.</p>', 'https://cdn.shopvnb.com/img/400/vo-cau-long-yonex-trang-ma-1452-chinh-hang.jpg', 1, '2025-11-18 22:51:09'),
(42, 'Áo Cầu Lông Yonex 2024', 'ao-yonex-2024', 'SHIRT24', 7, 1, 450000.00, 450000.00, '{\"material\": \"Polyester\"}', '<p>Áo thi đấu thoáng mát.</p>', 'https://cdn.shopvnb.com/img/400/ao-cau-long-yonex-10500-trang-chinh-hang.jpg', 1, '2025-11-18 22:51:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `display_order`) VALUES
(1, 1, 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-astrox-100zz-kurenai-do-chinh-hang-1.jpg', 1),
(2, 1, 'https://cdn.shopvnb.com/img/400/vot-cau-long-yonex-astrox-100zz-kurenai-do-chinh-hang-2.jpg', 2),
(3, 17, 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-65z3-trang-bach-ho-se-2024-noi-dia-nhat-1.jpg', 1),
(4, 17, 'https://cdn.shopvnb.com/img/400/giay-cau-long-yonex-65z3-trang-bach-ho-se-2024-noi-dia-nhat-2.jpg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `sku` varchar(50) NOT NULL,
  `variant_name` varchar(100) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `attributes` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `variant_name`, `price`, `stock_quantity`, `attributes`) VALUES
(1, 1, 'AX100ZZ-4U', '4U / G5', 3850000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(2, 2, 'AX88D-PRO-4U', '4U / G5', 3500000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(3, 3, 'AX77-PRO-4U', '4U / G5', 3200000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(4, 4, 'NF1000Z-4U', '4U / G5', 3900000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(5, 5, 'NF800-PRO-4U', '4U / G5', 3600000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(6, 6, 'ARC11-PRO-4U', '4U / G5', 3600000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(7, 7, 'ARC7-PRO-4U', '4U / G5', 3400000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(8, 8, 'AX100-4U', '4U / G5', 4200000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(9, 9, 'AX90-TIGER-4U', '4U / G5', 3900000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(10, 10, 'AX80-4U', '4U / G5', 3800000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(11, 11, 'HB8000-4U', '4U / G5', 3800000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(12, 12, 'RYUGA2-4U', '4U / G5', 3100000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(13, 13, 'TK-F-4U', '4U / G5', 3200000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(14, 14, 'FT11Q-4U', '4U / G5', 3600000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(15, 15, 'PC99PRO-4U', '4U / G5', 850000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(16, 16, 'P23-4U', '4U / G5', 750000.00, 10, '{\"grip\": \"G5\", \"weight\": \"4U\"}'),
(32, 1, 'AX100ZZ-3U', '3U / G5', 3850000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(33, 2, 'AX88D-PRO-3U', '3U / G5', 3500000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(34, 3, 'AX77-PRO-3U', '3U / G5', 3200000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(35, 4, 'NF1000Z-3U', '3U / G5', 3900000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(36, 5, 'NF800-PRO-3U', '3U / G5', 3600000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(37, 6, 'ARC11-PRO-3U', '3U / G5', 3600000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(38, 7, 'ARC7-PRO-3U', '3U / G5', 3400000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(39, 8, 'AX100-3U', '3U / G5', 4200000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(40, 9, 'AX90-TIGER-3U', '3U / G5', 3900000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(41, 10, 'AX80-3U', '3U / G5', 3800000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(42, 11, 'HB8000-3U', '3U / G5', 3800000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(43, 12, 'RYUGA2-3U', '3U / G5', 3100000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(44, 13, 'TK-F-3U', '3U / G5', 3200000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(45, 14, 'FT11Q-3U', '3U / G5', 3600000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(46, 15, 'PC99PRO-3U', '3U / G5', 850000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(47, 16, 'P23-3U', '3U / G5', 750000.00, 5, '{\"grip\": \"G5\", \"weight\": \"3U\"}'),
(63, 17, 'SHB65Z3-WT-39', 'Size 39', 2500000.00, 5, '{\"size\": \"39\"}'),
(64, 18, 'SHB65Z3-BK-39', 'Size 39', 2400000.00, 5, '{\"size\": \"39\"}'),
(65, 19, 'SHBAZ2-BL-39', 'Size 39', 2600000.00, 5, '{\"size\": \"39\"}'),
(66, 20, 'SHBELZ3-39', 'Size 39', 2800000.00, 5, '{\"size\": \"39\"}'),
(67, 21, 'AYAT003-39', 'Size 39', 2300000.00, 5, '{\"size\": \"39\"}'),
(68, 22, 'SAGALITE7-39', 'Size 39', 1100000.00, 5, '{\"size\": \"39\"}'),
(69, 23, 'P9200III-39', 'Size 39', 2400000.00, 5, '{\"size\": \"39\"}'),
(70, 24, 'A970ACE-39', 'Size 39', 2300000.00, 5, '{\"size\": \"39\"}'),
(71, 25, 'WAVECLAW2-39', 'Size 39', 2200000.00, 5, '{\"size\": \"39\"}'),
(72, 26, 'K173-39', 'Size 39', 850000.00, 5, '{\"size\": \"39\"}'),
(73, 27, 'KHD82-39', 'Size 39', 650000.00, 5, '{\"size\": \"39\"}'),
(74, 17, 'SHB65Z3-WT-40', 'Size 40', 2500000.00, 8, '{\"size\": \"40\"}'),
(75, 18, 'SHB65Z3-BK-40', 'Size 40', 2400000.00, 8, '{\"size\": \"40\"}'),
(76, 19, 'SHBAZ2-BL-40', 'Size 40', 2600000.00, 8, '{\"size\": \"40\"}'),
(77, 20, 'SHBELZ3-40', 'Size 40', 2800000.00, 8, '{\"size\": \"40\"}'),
(78, 21, 'AYAT003-40', 'Size 40', 2300000.00, 8, '{\"size\": \"40\"}'),
(79, 22, 'SAGALITE7-40', 'Size 40', 1100000.00, 8, '{\"size\": \"40\"}'),
(80, 23, 'P9200III-40', 'Size 40', 2400000.00, 8, '{\"size\": \"40\"}'),
(81, 24, 'A970ACE-40', 'Size 40', 2300000.00, 8, '{\"size\": \"40\"}'),
(82, 25, 'WAVECLAW2-40', 'Size 40', 2200000.00, 8, '{\"size\": \"40\"}'),
(83, 26, 'K173-40', 'Size 40', 850000.00, 8, '{\"size\": \"40\"}'),
(84, 27, 'KHD82-40', 'Size 40', 650000.00, 8, '{\"size\": \"40\"}'),
(85, 17, 'SHB65Z3-WT-41', 'Size 41', 2500000.00, 10, '{\"size\": \"41\"}'),
(86, 18, 'SHB65Z3-BK-41', 'Size 41', 2400000.00, 10, '{\"size\": \"41\"}'),
(87, 19, 'SHBAZ2-BL-41', 'Size 41', 2600000.00, 10, '{\"size\": \"41\"}'),
(88, 20, 'SHBELZ3-41', 'Size 41', 2800000.00, 10, '{\"size\": \"41\"}'),
(89, 21, 'AYAT003-41', 'Size 41', 2300000.00, 10, '{\"size\": \"41\"}'),
(90, 22, 'SAGALITE7-41', 'Size 41', 1100000.00, 10, '{\"size\": \"41\"}'),
(91, 23, 'P9200III-41', 'Size 41', 2400000.00, 10, '{\"size\": \"41\"}'),
(92, 24, 'A970ACE-41', 'Size 41', 2300000.00, 10, '{\"size\": \"41\"}'),
(93, 25, 'WAVECLAW2-41', 'Size 41', 2200000.00, 10, '{\"size\": \"41\"}'),
(94, 26, 'K173-41', 'Size 41', 850000.00, 10, '{\"size\": \"41\"}'),
(95, 27, 'KHD82-41', 'Size 41', 650000.00, 10, '{\"size\": \"41\"}'),
(96, 17, 'SHB65Z3-WT-42', 'Size 42', 2500000.00, 10, '{\"size\": \"42\"}'),
(97, 18, 'SHB65Z3-BK-42', 'Size 42', 2400000.00, 10, '{\"size\": \"42\"}'),
(98, 19, 'SHBAZ2-BL-42', 'Size 42', 2600000.00, 10, '{\"size\": \"42\"}'),
(99, 20, 'SHBELZ3-42', 'Size 42', 2800000.00, 10, '{\"size\": \"42\"}'),
(100, 21, 'AYAT003-42', 'Size 42', 2300000.00, 10, '{\"size\": \"42\"}'),
(101, 22, 'SAGALITE7-42', 'Size 42', 1100000.00, 10, '{\"size\": \"42\"}'),
(102, 23, 'P9200III-42', 'Size 42', 2400000.00, 10, '{\"size\": \"42\"}'),
(103, 24, 'A970ACE-42', 'Size 42', 2300000.00, 10, '{\"size\": \"42\"}'),
(104, 25, 'WAVECLAW2-42', 'Size 42', 2200000.00, 10, '{\"size\": \"42\"}'),
(105, 26, 'K173-42', 'Size 42', 850000.00, 10, '{\"size\": \"42\"}'),
(106, 27, 'KHD82-42', 'Size 42', 650000.00, 10, '{\"size\": \"42\"}'),
(107, 17, 'SHB65Z3-WT-43', 'Size 43', 2500000.00, 5, '{\"size\": \"43\"}'),
(108, 18, 'SHB65Z3-BK-43', 'Size 43', 2400000.00, 5, '{\"size\": \"43\"}'),
(109, 19, 'SHBAZ2-BL-43', 'Size 43', 2600000.00, 5, '{\"size\": \"43\"}'),
(110, 20, 'SHBELZ3-43', 'Size 43', 2800000.00, 5, '{\"size\": \"43\"}'),
(111, 21, 'AYAT003-43', 'Size 43', 2300000.00, 5, '{\"size\": \"43\"}'),
(112, 22, 'SAGALITE7-43', 'Size 43', 1100000.00, 5, '{\"size\": \"43\"}'),
(113, 23, 'P9200III-43', 'Size 43', 2400000.00, 5, '{\"size\": \"43\"}'),
(114, 24, 'A970ACE-43', 'Size 43', 2300000.00, 5, '{\"size\": \"43\"}'),
(115, 25, 'WAVECLAW2-43', 'Size 43', 2200000.00, 5, '{\"size\": \"43\"}'),
(116, 26, 'K173-43', 'Size 43', 850000.00, 5, '{\"size\": \"43\"}'),
(117, 27, 'KHD82-43', 'Size 43', 650000.00, 5, '{\"size\": \"43\"}'),
(126, 28, 'BG65TI-WHT', 'Màu Trắng', 150000.00, 100, '{\"color\": \"White\"}'),
(127, 29, 'BG66UM-WHT', 'Màu Trắng', 170000.00, 100, '{\"color\": \"White\"}'),
(128, 30, 'EXBOLT63-WHT', 'Màu Trắng', 180000.00, 100, '{\"color\": \"White\"}'),
(129, 31, 'EXBOLT65-WHT', 'Màu Trắng', 180000.00, 100, '{\"color\": \"White\"}'),
(130, 32, 'NO1-WHT', 'Màu Trắng', 160000.00, 100, '{\"color\": \"White\"}'),
(131, 33, 'VBS66-WHT', 'Màu Trắng', 155000.00, 100, '{\"color\": \"White\"}'),
(132, 34, 'Z69-WHT', 'Màu Trắng', 140000.00, 100, '{\"color\": \"White\"}'),
(133, 28, 'BG65TI-YLW', 'Màu Chuối', 150000.00, 50, '{\"color\": \"Yellow\"}'),
(134, 29, 'BG66UM-YLW', 'Màu Chuối', 170000.00, 50, '{\"color\": \"Yellow\"}'),
(135, 30, 'EXBOLT63-YLW', 'Màu Chuối', 180000.00, 50, '{\"color\": \"Yellow\"}'),
(136, 31, 'EXBOLT65-YLW', 'Màu Chuối', 180000.00, 50, '{\"color\": \"Yellow\"}'),
(137, 32, 'NO1-YLW', 'Màu Chuối', 160000.00, 50, '{\"color\": \"Yellow\"}'),
(138, 33, 'VBS66-YLW', 'Màu Chuối', 155000.00, 50, '{\"color\": \"Yellow\"}'),
(139, 34, 'Z69-YLW', 'Màu Chuối', 140000.00, 50, '{\"color\": \"Yellow\"}'),
(140, 35, 'BAG229BP-STD', 'Tiêu chuẩn', 850000.00, 20, NULL),
(141, 36, 'ABJT055-STD', 'Tiêu chuẩn', 1200000.00, 20, NULL),
(142, 37, 'BR9609-STD', 'Tiêu chuẩn', 950000.00, 20, NULL),
(143, 40, 'AC489-STD', 'Tiêu chuẩn', 80000.00, 20, NULL),
(144, 38, 'AC102EX-STD', 'Tiêu chuẩn', 150000.00, 20, NULL),
(145, 39, 'VS-VAI-STD', 'Tiêu chuẩn', 20000.00, 20, NULL),
(146, 41, 'SOCK3D-STD', 'Tiêu chuẩn', 120000.00, 20, NULL),
(147, 42, 'SHIRT24-STD', 'Tiêu chuẩn', 450000.00, 20, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `rating` tinyint(1) NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` enum('customer','staff','admin') DEFAULT 'customer',
  `loyalty_points` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `address`, `role`, `loyalty_points`, `created_at`, `updated_at`) VALUES
(1, 'admin@badminton.vn', '$2y$10$DummyHashForAdmin', 'Admin Quản Trị', '0909999888', 'Văn phòng chính TP.HCM', 'admin', 0, '2025-11-18 22:51:09', '2025-11-18 22:51:09'),
(2, 'khachhang@gmail.com', '$2y$10$DummyHashForUser', 'Nguyễn Văn A', '0918123456', '123 Cầu Giấy, Hà Nội', 'customer', 0, '2025-11-18 22:51:09', '2025-11-18 22:51:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
