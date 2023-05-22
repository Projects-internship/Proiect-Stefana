-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2023 at 10:05 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dawnair`
--

-- --------------------------------------------------------

--
-- Table structure for table `groupchat`
--

CREATE TABLE `groupchat` (
  `group_id` int(6) NOT NULL,
  `groupname` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groupchat`
--

INSERT INTO `groupchat` (`group_id`, `groupname`) VALUES
(1, 'Management'),
(2, 'HR'),
(3, 'Crew'),
(4, 'Security'),
(5, 'Marketing'),
(6, 'Cleaning'),
(7, 'ew');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `user_id` int(6) DEFAULT NULL,
  `group_id` int(6) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `user_id`, `group_id`, `content`, `timestamp`) VALUES
(2, 1, 3, 'Buna!', '2023-04-05 14:59:34'),
(3, 2, 3, 'Buna,Cezar!', '2023-04-05 14:55:59'),
(8, 5, 3, 'HELO', '2023-04-06 06:45:01'),
(9, 5, 3, 'HELO', '2023-04-06 06:45:09'),
(10, 5, 3, 'sunt si eu aici', '2023-04-06 06:45:18'),
(11, 2, 4, 'Security', '2023-04-06 11:10:56'),
(14, 2, 4, 'test 2 -> add msg to todo list', '2023-04-06 14:39:59'),
(15, 2, 4, 'test 2', '2023-04-06 14:40:16'),
(16, 2, 4, 'test', '2023-04-06 14:40:56'),
(17, 2, 4, 'test', '2023-04-06 14:41:18'),
(22, 2, 6, 'easter cleaning needs to be done ', '2023-04-06 17:26:22'),
(33, 2, 6, 'sasa', '2023-04-07 05:13:52'),
(34, 5, 3, 'pa cezaar', '2023-04-24 09:35:47'),
(35, 5, 3, 'heheheheheheheh', '2023-04-24 09:35:58'),
(39, 2, 6, 'j', '2023-05-03 05:56:18'),
(41, 2, 5, 'nu inteleg exact', '2023-05-03 06:05:35'),
(44, 2, 6, 'f', '2023-05-03 06:25:58'),
(45, 2, 6, 'dfcv', '2023-05-03 06:26:00'),
(46, 2, 6, 'xcxc', '2023-05-03 06:26:01'),
(49, 2, 6, 'cv', '2023-05-03 06:26:06'),
(50, 2, 6, 'gh', '2023-05-03 06:26:53'),
(51, 2, 6, 'gh', '2023-05-03 06:26:56'),
(52, 2, 4, 'fgfg', '2023-05-03 06:39:26'),
(54, 2, 3, 'atat', '2023-05-03 15:16:36'),
(55, 2, 1, 'Buna!', '2023-05-21 15:37:41'),
(57, 2, 3, 'Hello!', '2023-05-21 15:42:29'),
(58, 2, 2, 'Buna Roxana!', '2023-05-21 15:42:35'),
(59, 5, 2, 'Buna Stefana!', '2023-05-21 15:42:39');

-- --------------------------------------------------------

--
-- Table structure for table `to_do_list`
--

CREATE TABLE `to_do_list` (
  `list_id` int(9) NOT NULL,
  `list_item` varchar(250) DEFAULT NULL,
  `user_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `to_do_list`
--

INSERT INTO `to_do_list` (`list_id`, `list_item`, `user_id`) VALUES
(9, 'eseu macro', 5),
(10, 'asa dc nu vrei', 5),
(11, 'buna ziua', 5),
(28, 'buy stefana flowers <3 ', 1),
(31, 'HELO', 5),
(32, 'HELO', 5),
(36, 'learn how to speak bucuresteana', 1),
(51, 'Cumpara unt', 2),
(52, 'Invata pentru test SDD', 2),
(53, 'Buna!', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(6) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(70) NOT NULL,
  `phone` int(13) NOT NULL,
  `position` varchar(40) NOT NULL,
  `birthday` varchar(40) NOT NULL,
  `hobby` varchar(40) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone`, `position`, `birthday`, `hobby`, `isAdmin`) VALUES
(1, 'CezarMARINESCU', 'marinescucezar21@stud.ase.ro', '$2b$10$uRkZC0PJI2auP2yS876OY.b4avLKezpboFeeZoiI3IsN2JzF7bNAi', 724047285, 'pilot', '15-04-2002', 'playing the guitar', 1),
(2, 'StefanaNISTOR', 'nistorstefana21@stud.ase.ro', '$2b$10$em1Rua6itvvZC5hZZgVuy.rGmw.vaWrz.c.GGZYlwzhzVcq3WGkoG', 755112953, 'CEO', '12-06-2002', 'cafea', 1),
(3, 'ElenaGEORGESCU', 'elenageorgescu@gmail.com', '$2b$10$k4SyoT2a95YuSKOCbqyIwuwgq2qbswNH4Mj5YrFHcZLsQAKwlszra', 744991081, 'security', '23-05-2002', 'walking', 0),
(4, 'TeodoraLICXANDRU', 'licxandruteodora21@stud.ase.ro', '$2b$10$6Z1EgU7.i0mgEgoZ0F70GO1J3XYyq75.oa2hyFLumYzmZDNLVMYzO', 730236865, 'flight attendant ', '30-05-2002', '', 0),
(5, 'RoxanaPETRESCU', 'roxanapetre@yahoo.com', '$2b$10$L1l8LZoDIDefuZws2kX61.Ib6wb3i/VA7tYMyRt9qOQAx0SPTwQky', 763645745, 'copilot', '14-08-2002', '', 0),
(6, 'SergiuRUSU', 'rususergiu12@yahoo.com', '$2b$10$T0nTMMVp/2n1WHe./CjsseevJ0pBV6tyVfa9ohPFCwHDizfMOmUi2', 737213087, 'HR', '12-02-2002', '', 0),
(7, 'RobertMILEA', 'robertmilea@gmail.com', '$2b$10$64kCNYx5mHN9avxV2/W5guwyhKd.q9u7kCndoRPL.qBWPlmnwXLna', 785311380, 'security', '07-02-2003', '', 0),
(8, 'PatriciaMIHAI', 'patrymihai@yahoo.com', '$2b$10$WQfed1lJm8tpnIr25Fam9.u9ymK7I236ykvK3nOKGi.dKXiSbvDzu', 723196423, 'HR', '16-12-2002', 'architecture', 0),
(9, 'SilvanaPAPA', 'silvanapapa@gmail.com', '$2b$10$GFLiWXyNpwljwsRJdZV6S.TK5KjOduDdY2VF/fNRuwRoiXOGNR.re', 747483647, 'HR', '24-02-2003', 'fashion', 0),
(10, 'StefanNICULAE', 'stefanniculae@gmail.com', '$2b$10$uXZ6CGlhHSJCzCOuhXEMmesTqJCRLTmmxEnHE0MKRJMFRp5hdFXYq', 711159834, 'pilot', '27-12-2002', '', 1),
(11, 'SiminaNISTOR', 'siminanistor@yahoo.com', '$2b$10$aSmYc9hUGlRwfX5QsxZFD.qbeQfm317JhrgZtN8kOZ/SgE6zYmqxi', 763758231, 'manager', '24-09-1977', '', 0),
(12, 'StelutaALEXANDRESCU', 'alexandrescusteluta@gmail.com', '$2b$10$NDmkKyrCHiKtCE7x9j6Rr.QcMmDAFLVwWYUQ3zQ9m71ZN8LhNdUsu', 742931981, 'marketing ', '11-03-1953', '', 0),
(13, 'RaduNITU', 'nituradumihai@yahoo.com', '$2b$10$Zzvyh3mXeMOF5TLDdX8xxu9UmWxg06ziF39lS0IF6LRy7mDX4N6Aa', 773139150, 'marketing', '05-01-1985', '', 0),
(14, 'RazvanCOROESCU', 'razvyrazvan@gmail.com', '$2b$10$NoJUdhw7AqbTYbemx9fEfO74ElRWrH3FBigB/tPBnui65RuQaTqFK', 723844565, 'cleaning', '21-10-1978', '', 0),
(15, 'LoredanaGROZA', 'grozalore@gmail.com', '$2b$10$2IyPpAhOJFx/S9yMigKdKelZkBAtD7Htn.XtKxKZJNy5u4wv2dlS6', 714973007, 'cleaning', '22-11-1987', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_in_group`
--

CREATE TABLE `user_in_group` (
  `user_id` int(6) DEFAULT NULL,
  `group_id` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_in_group`
--

INSERT INTO `user_in_group` (`user_id`, `group_id`) VALUES
(10, 3),
(4, 3),
(5, 3),
(6, 2),
(8, 2),
(9, 2),
(2, 1),
(11, 1),
(3, 4),
(7, 4),
(2, 3),
(2, 2),
(2, 4),
(2, 6),
(2, 5),
(12, 5),
(13, 5),
(14, 6),
(15, 6),
(1, 3),
(5, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groupchat`
--
ALTER TABLE `groupchat`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `fk_user_message` (`user_id`),
  ADD KEY `fk_group_message` (`group_id`);

--
-- Indexes for table `to_do_list`
--
ALTER TABLE `to_do_list`
  ADD PRIMARY KEY (`list_id`),
  ADD KEY `fk_user_list` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`,`email`,`password`,`phone`);

--
-- Indexes for table `user_in_group`
--
ALTER TABLE `user_in_group`
  ADD KEY `fk_user_group` (`user_id`),
  ADD KEY `fk_group_user` (`group_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_group_message` FOREIGN KEY (`group_id`) REFERENCES `groupchat` (`group_id`),
  ADD CONSTRAINT `fk_user_message` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `to_do_list`
--
ALTER TABLE `to_do_list`
  ADD CONSTRAINT `fk_user_list` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_in_group`
--
ALTER TABLE `user_in_group`
  ADD CONSTRAINT `fk_group_user` FOREIGN KEY (`group_id`) REFERENCES `groupchat` (`group_id`),
  ADD CONSTRAINT `fk_user_group` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
