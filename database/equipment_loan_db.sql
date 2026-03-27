-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2026 at 05:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `equipment_loan_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','rejected','returned') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `booking_details`
-- (See below for the actual view)
--
CREATE TABLE `booking_details` (
`user_name` varchar(100)
,`equipment_name` varchar(100)
,`serial_number` varchar(100)
,`start_date` date
,`end_date` date
,`status` enum('pending','approved','rejected','returned')
);

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `status` enum('available','pending','borrowed','disinfecting') NOT NULL DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `category`, `serial_number`, `status`) VALUES
(6, 'Dell Latitude Laptop', 'Laptop', 'SN-LAP-001', 'available'),
(7, 'HP ProBook Laptop', 'Laptop', 'SN-LAP-002', 'available'),
(8, 'Raspberry Pi 4', 'IoT Device', 'SN-IOT-001', 'available'),
(9, 'Arduino Uno', 'Hardware', 'SN-HW-001', 'available'),
(10, 'ESP32 Development Board', 'IoT Device', 'SN-IOT-002', 'available'),
(11, 'Epson Projector', 'Projector', 'SN-PROJ-001', 'available'),
(12, 'Logitech Webcam', 'Peripheral', 'SN-PER-001', 'available'),
(13, '20-inch Monitor', 'Hardware', 'SN-HW-002', 'available'),
(14, '8-Port Network Switch', 'Networking', 'SN-NET-001', 'available'),
(15, 'IoT Sensor Kit', 'IoT Device', 'SN-IOT-003', 'borrowed'),
(16, 'Smart thermostats', 'IoT Device', 'SN-HO-005', 'available');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','staff','admin') NOT NULL DEFAULT 'student',
  `password_changed` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `password_changed`) VALUES
(1, 'Admin User', 'admin@ncg.ac.uk', '$2b$10$9oMTh6r/8UcDY8NtnAKQcuD9KixSeVrpenvbL6bCfTyLF0FNAnv3W', 'admin', 0),
(2, 'Test Student', 'student@ncg.ac.uk', '$2b$10$1EO1GDoBG5o5sC4DVgg1BOIhMtFef0FL5ctUitZCsBl1aFcPC15q.', 'student', 0),
(3, 'Staff User', 'staff@ncg.ac.uk', '$2b$10$bPvwuO7CfY.bAZaVE.6Pxu3fhm0zCQg6v2GpaJcUpTmRitkkLIs0q', 'staff', 1);

-- --------------------------------------------------------

--
-- Structure for view `booking_details`
--
DROP TABLE IF EXISTS `booking_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `booking_details`  AS SELECT `u`.`name` AS `user_name`, `e`.`name` AS `equipment_name`, `e`.`serial_number` AS `serial_number`, `b`.`start_date` AS `start_date`, `b`.`end_date` AS `end_date`, `b`.`status` AS `status` FROM ((`bookings` `b` join `users` `u` on(`b`.`user_id` = `u`.`id`)) join `equipment` `e` on(`b`.`equipment_id` = `e`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`);

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
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
