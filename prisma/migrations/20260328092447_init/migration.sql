/*
  Warnings:

  - You are about to drop the column `branch` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `college` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `rollNo` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `user` table. All the data in the column will be lost.
  - The values [ADMIN] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registrationid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teammember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `registration` DROP FOREIGN KEY `registration_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `registration` DROP FOREIGN KEY `registration_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `teamMember_registrationId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `branch`,
    DROP COLUMN `college`,
    DROP COLUMN `mobile`,
    DROP COLUMN `rollNo`,
    DROP COLUMN `semester`,
    ADD COLUMN `ISBPL` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `gender` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `isEWS` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isPWD` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('USER', 'FARMER', 'STUDENT', 'GOVERNMENT_EMPLOYEE', 'PRIVATE_EMPLOYEE', 'DAILY_WAGER', 'UNEMPLOYED', 'SELF_EMPLOYED', 'DEFENSE_PERSONNEL') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `event`;

-- DropTable
DROP TABLE `registration`;

-- DropTable
DROP TABLE `registrationid`;

-- DropTable
DROP TABLE `teammember`;

-- CreateTable
CREATE TABLE `Scheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheme_name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `details` VARCHAR(191) NULL,
    `benefits` VARCHAR(191) NULL,
    `eligibility` VARCHAR(191) NULL,
    `application` VARCHAR(191) NULL,
    `documents` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `schemeCategory` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `level_name` VARCHAR(191) NULL,
    `search_tags` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
