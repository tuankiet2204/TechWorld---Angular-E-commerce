-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 25, 2025 at 06:09 AM
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
-- Database: `laptop_node`
--

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `otp` varchar(255) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  `failedLoginAttempts` int DEFAULT '0',
  `accountLockedUntil` datetime DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `ho_ten`, `email`, `password`, `createdAt`, `updatedAt`, `isVerified`, `otp`, `otp_expires`, `failedLoginAttempts`, `accountLockedUntil`, `role`) VALUES
(7, 'Test User', 'trinhkietcv22041@gmail.com', '$2b$10$e3s7ZZOFdUtObaxFmosAgukqvoS.UsFADOsdqE05ER68Zfyx3SzV2', '2025-11-14 16:24:20', '2025-11-16 09:01:39', 1, NULL, NULL, 5, '2025-11-16 09:16:39', 'user'),
(20, 'Trịnh Tuấn Kiệt', 'tuankiet2204010@gmail.com', '$2b$10$diAEUedh.W83vRBRAezPROv78lt3rclV7bJvUI6eukHZJtku9oKRS', '2025-11-14 17:57:47', '2025-11-14 17:58:03', 1, NULL, NULL, 0, NULL, 'user'),
(24, 'Trịnh Tuấn Kiệt', 'trinhkietcv111@gmail.com', '$2b$10$AFOcJCptpz1K30ZYZPl28eHTEZKknaRfOWk8/f7CmXZzMyf/4ClxG', '2025-11-17 06:03:11', '2025-11-25 06:08:00', 1, NULL, NULL, 0, NULL, 'admin'),
(25, 'Hữu thiện', 'thiendihoc2025@gmail.com', '$2b$10$aHQG5riFCfqPvEQLZ7qRB.JfFyG/B/Q32MN0lwvzX6.8LAS01E27O', '2025-11-21 02:37:34', '2025-11-21 02:40:19', 1, NULL, NULL, 5, '2025-11-21 02:55:19', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
