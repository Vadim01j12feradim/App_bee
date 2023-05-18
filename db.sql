-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 18, 2023 at 10:07 PM
-- Server version: 10.5.16-MariaDB
-- PHP Version: 7.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `id20472336_bee_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `sesion`
--

CREATE TABLE `sesion` (
  `id_sesion` int(11) NOT NULL,
  `foto` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `longitud` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `descripcion` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sesion`
--

INSERT INTO `sesion` (`id_sesion`, `foto`, `latitude`, `longitud`, `descripcion`, `id`) VALUES
(15, '93dea146-433d-44f8-b2df-ed456c0a2e88.jpeg', 'Undefined', 'Undefined', 'prueba de funcion UNO', 1),
(16, '93dea146-433d-44f8-b2df-ed456c0a2e88.jpeg', 'Undefined', 'Undefined', 'prueba de funcion dos', 1),
(17, 'beaa75fd-0f9a-408a-9349-88c63ec1e078.jpeg', 'Undefined', 'Undefined', 'ok', 1),
(18, '0d629392-d565-4f2d-9b74-45fd01c36d5f.jpeg', '21.32924072536', '-99.565906673667', 'OK ok', 1),
(19, '1e2b5cf9-4e71-4513-9acd-bf54b9066948.jpeg', '21.32924072536', '-99.565906673667', 'Observation', 1),
(20, '735b4b44-b6a7-4893-b19d-c73dcb10eedc.jpeg', '21.32924072536', '-99.565906673667', 'Sesion de prueba', 9),
(21, '732BCC3A-E1E6-4415-959B-59CBA612FA50.png', 'Undefined', 'Undefined', 'Of course', 9),
(22, '732BCC3A-E1E6-4415-959B-59CBA612FA50.png', 'Undefined', 'Undefined', 'Of course', 9),
(23, '1D69346C-AFC7-4D7C-B301-017624F96FCD.jpg', 'Undefined', 'Undefined', 'Of course ', 1),
(24, 'D9848222-C7C7-4D39-8636-5E849FF7EBE7.jpg', 'Undefined', 'Undefined', 'Null or none', 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sesion`
--
ALTER TABLE `sesion`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `usuario_sesion_fk` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sesion`
--
ALTER TABLE `sesion`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sesion`
--
ALTER TABLE `sesion`
  ADD CONSTRAINT `usuario_sesion_fk` FOREIGN KEY (`id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
