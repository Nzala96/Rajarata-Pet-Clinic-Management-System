-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2024 at 12:00 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rpc`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tp` int(11) NOT NULL,
  `date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `petname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `docname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `name`, `email`, `tp`, `date`, `petname`, `docname`, `message`, `created_at`, `updated_at`) VALUES
(3, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 768354494, '2024-10-04T20:22', 'Kane', 'Doctor1', 'Test', NULL, NULL),
(4, 'John Doe', 'johndoe@example.com', 1234567890, '2024-10-05', 'Buddy', 'Dr. Smith', 'Regular check-up for my dog.', NULL, NULL),
(5, 'John Doe', 'johndoe@example.com', 1234567890, '2024-10-05', 'Buddy', 'Dr. Smith', 'Regular check-up for my dog.', '2024-10-04 18:30:00', '2024-10-04 18:30:00'),
(6, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 768354494, '2024-10-10T20:34', 'Teddy', 'Doctor1', 'Test1 Test1', '2024-10-05 09:34:07', '2024-10-06 02:34:30'),
(8, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 112683768, '2024-10-19T12:01', 'tedy', 'Doctor1', 'Hello', '2024-10-06 01:01:27', '2024-10-06 01:01:27'),
(9, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 1123345678, '2024-10-04T12:01', 'teddy3', 'Doctor2', 'Hello 1', '2024-10-06 01:01:56', '2024-10-06 01:01:56'),
(10, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 1111111111, '2024-10-25T12:46', 'Test2', 'Doctor1', 'Test3 Appionment', '2024-10-06 01:46:39', '2024-10-06 02:33:54'),
(11, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', 705645721, '2024-10-08T12:20', 'Bool', 'testDoctor2', 'hi', '2024-10-07 11:16:57', '2024-10-07 11:16:57'),
(12, 'Nuwansala Kumarasinghe', 'nuwak1996@gmail.com', 712667071, '2024-10-10T12:22', 'Kane', 'Doctor2', 'Want a appointment', '2024-10-09 00:21:58', '2024-10-09 00:21:58');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `coname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cemail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cosub` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comsg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cemail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctp` int(11) NOT NULL,
  `cpetname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `demail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dtp` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `dname`, `demail`, `dtp`, `created_at`, `updated_at`) VALUES
(1000, 'testDoctor2', 'Doctor1@gmail.com', '0112345667', NULL, NULL),
(1001, 'Doctor2', 'Doctor2@gmail.com', '0112683768', '2024-10-01 13:59:50', '2024-10-01 13:59:50'),
(1003, 'doctor3', 'doctor3@gmail.com', '123123123', '2024-10-04 18:30:00', '2024-10-04 18:30:00'),
(1004, 'doctor4', 'doctor4@gmail.com', '123123123', '2024-10-04 18:30:00', '2024-10-04 18:30:00'),
(1005, 'Test Doctor 4', 'testDoc4@gmail.com', '0112683768', '2024-10-06 02:49:48', '2024-10-06 02:49:48');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(28, '2014_10_12_000000_create_users_table', 1),
(29, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(30, '2019_08_19_000000_create_failed_jobs_table', 1),
(31, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(32, '2024_03_08_050704_create_appointments_table', 1),
(33, '2024_03_09_001646_create_customers_table', 1),
(34, '2024_03_09_013829_create_doctors_table', 1),
(35, '2024_03_09_024255_create_contacts_table', 1),
(36, '2024_09_26_183233_change_isadmin_type_in_users_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `isAdmin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `isAdmin`) VALUES
(1, 'John Doe', 'john.d22@example.com', NULL, '$2y$12$S0hQpHtC/LagLlXGwjblTeAO8FbS9xJmf9tbz8u4kxCVnQeYPjyje', NULL, '2024-10-01 08:24:41', '2024-10-01 08:24:41', 'false'),
(2, 'John Doe', 'john.d23@example.com', NULL, '$2y$12$dZUitZzC1fXSjHKOsMQPK.NL8BAc9hOb6PFYE05yHyayfJx36MetK', NULL, '2024-10-01 08:28:50', '2024-10-01 08:28:50', 'false'),
(3, 'Nuwansala Deshanjali', 'wjanodyasamoshi@gmail.com', NULL, '$2y$12$GHwcMlG.KIWtmA3jFP.LueybY/zuOvBltxfcgPnQWed7ZXugwYiva', NULL, '2024-10-01 08:48:46', '2024-10-01 08:48:46', 'false'),
(4, 'Nuwansala Deshanjali', 'wjanodyasamo@gmail.com', NULL, '$2y$12$DX3ZVEhiaR.luvUSGMdQbeMu44v0IZLO396X2c.MAb0dIksWI6NSG', NULL, '2024-10-01 08:56:46', '2024-10-01 08:56:46', 'false'),
(5, 'Admin Admin', 'admin@gmail.com', NULL, '$2y$12$FjUi3cDQvq12zyNDWCe.n.DkzVNm5TwyNodNmxSA.F/bf3vcfh2Yi', NULL, '2024-10-08 20:45:54', '2024-10-08 20:45:54', 'true'),
(6, 'Nuwansala Kumarasinghe', 'nuwak1996@gmail.com', NULL, '$2y$12$N9BfjVu.3rpN8O0LLRkKK.3CN9GaZRQmO4VV9yoMhGK/ZlM//bviq', NULL, '2024-10-08 22:51:12', '2024-10-08 22:51:12', 'false'),
(7, 'Anura Ekanayake', 'anura@gmail.com', NULL, '$2y$12$F3kiZdwmT/Rr6SDvW9ik0.rSgtClD.6lkKqTypjluSCQL8NL7/9h2', NULL, '2024-10-09 00:25:13', '2024-10-09 00:25:13', 'false');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1006;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
