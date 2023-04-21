-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 21-04-2023 a las 22:00:18
-- Versión del servidor: 10.5.16-MariaDB
-- Versión de PHP: 7.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `id20635817_ipp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `lastName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `zip` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `dateCreated` date DEFAULT NULL,
  `dateModified` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `email`, `phone`, `zip`, `dateCreated`, `dateModified`) VALUES
(31, 'Craig', 'Martin', 'CM@outlook.com', '2020-2020', '93722', '2022-04-21', NULL),
(32, 'Noel', 'Anderson', 'NA@outlook.com', '3030-3030', '92704', '2022-04-20', NULL),
(33, 'Jaime', 'Mclean', 'JM@hotmal.com', '4040-4040', '11219', '2022-09-03', NULL),
(34, 'Joshua', 'Mitchell', 'JM@yahoo.com', '5050-5050', '91709', '2022-01-27', NULL),
(35, 'Alexis', 'Johnstone', 'AJ@gmail.com', '6060-6060', '11212', '2022-06-29', NULL),
(36, 'Carlos', 'Mitchell', 'CM@yahoo.com', '7070-7070', '77494', '2023-04-21', NULL),
(37, 'Troy', 'Findlay', 'TF@hotmail.com', '8080-8080', '90011', '2022-03-21', NULL),
(38, 'Cedric', 'Watson', 'CW@hotmail.com', '9090-9090', '91342', '2022-10-05', NULL),
(39, 'George', 'Williamson', 'GW@gmail.com', '1010-1010', '30044', '2022-01-09', NULL),
(40, 'Marion', 'Fraser', 'MF@gmail.com', '1111-1111', '91911', '2022-06-14', NULL),
(41, 'Joe', 'Findlay', 'JF@yahoo.com', '1212-1212', '60629', '2022-02-15', NULL),
(42, 'Connor', 'Jamieson', 'CJ@yahoo.com', '1313-1313', '75052', '2022-04-16', NULL),
(43, 'Wiley', 'Maclean', 'WM@yahoo.com', '1414-1414', '10453', '2023-01-29', NULL),
(44, 'Alberto', 'Mcdonald', 'AM@gmail.com', '1515-1515', '37013', '2022-12-11', NULL),
(45, 'Ron', 'Johnstone', 'RJ@gmail.com', '1616-1616', '90011', '2022-10-12', NULL),
(46, 'Morris', 'Douglas', 'MD@yahoo.com', '1717-1717', '10456', '2023-02-08', NULL),
(47, 'Perry', 'Graham', 'PG@outlook.com', '1818-1818', '66062', '2022-09-14', NULL),
(48, 'Liam', 'Kennedy', 'LK@outlook.com', '1919-1919', '30043', '2022-09-12', NULL),
(49, 'Paul', 'Hamilton', 'PH@gmail.com', '2020-2020', '90011', '2023-01-05', NULL),
(50, 'Miles', 'Mckenzie', 'MM@yahoo.com', '2121-2121', '11234', '2022-01-22', NULL),
(51, 'Shane', 'Robertson', 'SR@hotmail.com', '2222-2222', '79936', '2022-06-18', NULL),
(52, 'Rick', 'Brown', 'RB@gmail.com', '2323-2323', '75070', '2022-03-05', NULL),
(53, 'Tristin', 'Simpson', 'TS@hotmail.com', '2424-2424', '77573', '2022-10-24', NULL),
(54, 'Glen', 'Mcdonald', 'GM@gmail.com', '2525-2525', '77449', '2023-04-07', NULL),
(55, 'Tommy', 'Paterson', 'TP@gmail.com', '2626-2626', '22193', '2022-04-08', NULL),
(56, 'Victor', 'Kelly', 'VK@outlook.com', '2727-2727', '92553', '2023-01-29', NULL),
(57, 'Joshua', 'Johnstone', 'JJ@hotmail.com', '2828-2828', '77573', '2023-03-22', NULL),
(58, 'Stefan', 'Black', 'SB@hotmail.com', '2929-2929', '30044', '2022-04-28', NULL),
(59, 'Aidan', 'Hunter', 'AH@outlook.com', '3030-3030', '77494', '2022-04-25', NULL),
(60, 'Gilbert', 'Johnston', 'GJ@yahoo.com', '3131-3131', '92154', '2022-10-26', NULL),
(61, 'Perry', 'Mclean', 'PM@yahoo.com', '3232-3232', '77573', '2022-07-18', NULL),
(62, 'Jerry', 'Johnston', 'JJ@gmail.com', '3333-3333', '10462', '2022-01-17', NULL),
(63, 'Ivan', 'Ross', 'IR@gmail.com', '3434-3434', '92683', '2022-07-17', NULL),
(64, 'Antonio', 'White', 'AW@outlook.com', '3535-3535', '77479', '2022-10-14', NULL),
(65, 'Alexis', 'Watt', 'AW@hotmail.com', '3636-3636', '93722', '2022-07-03', NULL),
(66, 'Julian', 'Aitken', 'JA@outlook.com', '3737-3737', '10452', '2022-12-07', NULL),
(67, 'Shane', 'Williamson', 'SW@gmail.com', '3838-3838', '90201', '2022-11-22', NULL),
(68, 'Glen', 'Sinclair', 'GS@yahoo.com', '3939-3939', '92154', '2022-11-26', NULL),
(69, 'Riley', 'Hughes', 'RH@gmail.com', '4040-4040', '93535', '2022-09-21', NULL),
(70, 'Morris', 'Munro', 'MM@hotmail.com', '4141-4141', '10468', '2022-03-27', NULL),
(71, 'Bruce', 'Martin', 'BM@hotmail.com', '4242-4242', '77084', '2022-01-27', NULL),
(72, 'Nathaniel', 'Munro', 'NM@outlook.com', '4343-4343', '11230', '2023-04-04', NULL),
(73, 'Dan', 'Wilson', 'DW@outlook.com', '4444-4444', '11219', '2023-02-01', NULL),
(74, 'Joe', 'Anderson', 'JA@hotmail.com', '4545-4545', '11377', '2023-02-23', NULL),
(75, 'Noel', 'Stevenson', 'NS@gmail.com', '4646-4646', '66062', '2022-12-07', NULL),
(76, 'Robin', 'Mackay', 'RM@yahoo.com', '4747-4747', '92509', '2022-09-04', NULL),
(77, 'Gerald', 'Gibson', 'GG@yahoo.com', '4848-4848', '93535', '2023-01-07', NULL),
(78, 'Stuart', 'Gordon', 'SG@outlook.com', '4949-4949', '8701', '2023-02-17', NULL),
(79, 'Keith', 'Mackenzie', 'KM@outlook.com', '5050-5050', '92336', '2022-11-19', NULL),
(80, 'Conner', 'Boyle', 'CB@hotmail.com', '5151-5151', '93065', '2022-05-15', NULL),
(81, 'Stefan', 'Kelly', 'SK@hotmail.com', '5252-5252', '94544', '2022-02-10', NULL),
(82, 'Paul', 'Burns', 'PB@gmail.com', '5353-5353', '28269', '2023-04-18', NULL),
(83, 'Liam', 'Johnston', 'LJ@hotmail.com', '5454-5454', '93535', '2022-04-03', NULL),
(84, 'Noel', 'Findlay', 'NF@gmail.com', '5555-5555', '10467', '2022-03-01', NULL),
(85, 'Romeo', 'Burns', 'RB@outlook.com', '5656-5656', '10456', '2022-08-04', NULL),
(86, 'Harold', 'Martin', 'HM@gmail.com', '5757-5757', '23464', '2022-07-22', NULL),
(87, 'Walter', 'Muir', 'WM@hotmail.com', '5858-5858', '90044', '2022-06-16', NULL),
(88, 'Douglas', 'Aitken', 'DA@outlook.com', '5959-5959', '11235', '2022-10-06', NULL),
(89, 'Brian', 'Kelly', 'BK@gmail.com', '6060-6060', '91910', '2022-08-03', NULL),
(90, 'Samuel', 'Stewart', 'SS@yahoo.com', '6161-6161', '91910', '2022-06-01', NULL),
(91, 'Arthur', 'Ferguson', 'AF@hotmail.com', '6262-6262', '10468', '2023-01-31', NULL),
(92, 'Bruce', 'Watt', 'BW@hotmail.com', '6363-6363', '94565', '2022-03-07', NULL),
(93, 'Claude', 'Mcdonald', 'CM@hotmail.com', '6464-6464', '10468', '2022-08-22', NULL),
(94, 'George', 'Burns', 'GB@hotmail.com', '6565-6565', '30349', '2022-08-05', NULL),
(95, 'Gilbert', 'Douglas', 'GD@outlook.com', '6666-6666', '11214', '2023-03-29', NULL),
(96, 'Liam', 'Taylor', 'LT@hotmail.com', '6767-6767', '77449', '2022-02-25', NULL),
(97, 'Orlando', 'Murphy', 'OM@hotmail.com', '6868-6868', '92553', '2022-10-20', NULL),
(98, 'Greyson', 'Millar', 'GM@yahoo.com', '6969-6969', '92154', '2023-01-13', NULL),
(99, 'Miles', 'Boyle', 'MB@gmail.com', '7070-7070', '93033', '2023-04-18', NULL),
(100, 'Marion', 'Bell', 'MB@outlook.com', '7171-7171', '11219', '2022-08-25', NULL),
(101, 'Stefan', 'Mclean', 'SM@gmail.com', '7272-7272', '95076', '2022-03-13', NULL),
(102, 'Alexis', 'Hill', 'AH@yahoo.com', '7373-7373', '91710', '2022-10-23', NULL),
(103, 'Gilbert', 'Wright', 'GW@outlook.com', '7474-7474', '93550', '2023-03-02', NULL),
(104, 'Charlie', 'White', 'CW@outlook.com', '7575-7575', '75070', '2022-11-30', NULL),
(105, 'Ramon', 'Gordon', 'RG@yahoo.com', '7676-7676', '60625', '2022-06-06', NULL),
(106, 'Ethan', 'Docherty', 'ED@outlook.com', '7777-7777', '90280', '2023-02-23', NULL),
(107, 'Roberto', 'Ross', 'RR@hotmail.com', '7878-7878', '77036', '2022-01-11', NULL),
(108, 'Blake', 'Docherty', 'BD@gmail.com', '7979-7979', '11373', '2023-03-16', NULL),
(109, 'Ivan', 'Duncan', 'ID@gmail.com', '8080-8080', '90250', '2022-02-11', NULL),
(110, 'Shawn', 'Stevenson', 'SS@gmail.com', '8181-8181', '11206', '2022-09-16', NULL),
(111, 'Marlin', 'Walker', 'MW@outlook.com', '8282-8282', '37013', '2022-11-27', NULL),
(112, 'Jaime', 'Duncan', 'JD@gmail.com', '8383-8383', '77573', '2022-01-18', NULL),
(113, 'Glen', 'Duncan', 'GD@gmail.com', '8484-8484', '77479', '2022-09-08', NULL),
(114, 'Arthur', 'Thompson', 'AT@gmail.com', '8585-8585', '10002', '2022-02-13', NULL),
(115, 'Perry', 'Watt', 'PW@hotmail.com', '8686-8686', '28269', '2022-10-09', NULL),
(116, 'Walter', 'Donaldson', 'WD@gmail.com', '8787-8787', '11226', '2022-11-06', NULL),
(117, 'Douglas', 'Jones', 'DJ@gmail.com', '8888-8888', '10453', '2022-02-24', NULL),
(118, 'Marion', 'Aitken', 'MA@gmail.com', '8989-8989', '22193', '2022-02-27', NULL),
(119, 'Dan', 'Reilly', 'DR@gmail.com', '9090-9090', '10029', '2022-12-04', NULL),
(120, 'Bruce', 'Walker', 'BW@yahoo.com', '9191-9191', '37013', '2022-12-08', NULL),
(121, 'Liam', 'Ross', 'LR@outlook.com', '9292-9292', '11373', '2022-05-01', NULL),
(122, 'Philip', 'Reid', 'PR@outlook.com', '9393-9393', '91706', '2022-09-14', NULL),
(123, 'Miles', 'Paterson', 'MP@outlook.com', '9494-9494', '75052', '2022-06-01', NULL),
(124, 'Arthur', 'Mcintosh', 'AM@outlook.com', '9595-9595', '91342', '2023-01-26', NULL),
(125, 'Riley', 'Miller', 'RM@outlook.com', '9696-9696', '77479', '2022-06-07', NULL),
(126, 'Douglas', 'Mitchell', 'DM@outlook.com', '9797-9797', '91710', '2022-01-10', NULL),
(127, 'Shawn', 'Dickson', 'SD@outlook.com', '9898-9898', '92345', '2022-08-02', NULL),
(128, 'Everett', 'Watson', 'EW@gmail.com', '9999-9999', '90805', '2022-08-14', NULL),
(129, 'Tommy', 'Cunningham', 'TC@gmail.com', '1001-1001', '23464', '2022-12-29', NULL),
(130, 'Test', 'Test', 'test@test.com', '1111-1111', '11111', '2023-04-21', '2023-04-21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
