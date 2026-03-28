-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `otpHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY') NOT NULL,
    `age` INTEGER NOT NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NOT NULL,
    `areaType` ENUM('URBAN', 'RURAL', 'SEMI_URBAN') NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `socialCategory` ENUM('GENERAL', 'OBC', 'SC', 'ST', 'OBC_NCL', 'EWS') NOT NULL,
    `isPwD` BOOLEAN NOT NULL,
    `occupation` ENUM('STUDENT', 'FARMER', 'SALARIED_EMPLOYEE', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'DAILY_WAGE_WORKER', 'HOMEMAKER', 'SENIOR_CITIZEN', 'UNEMPLOYED', 'OTHER') NOT NULL,
    `isBPL` BOOLEAN NOT NULL,
    `annualIncome` ENUM('BELOW_1_LAKH', 'BETWEEN_1_TO_3_LAKH', 'BETWEEN_3_TO_5_LAKH', 'BETWEEN_5_TO_10_LAKH', 'ABOVE_10_LAKH') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `otp_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY') NOT NULL,
    `age` INTEGER NOT NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NOT NULL,
    `areaType` ENUM('URBAN', 'RURAL', 'SEMI_URBAN') NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `socialCategory` ENUM('GENERAL', 'OBC', 'SC', 'ST', 'OBC_NCL', 'EWS') NOT NULL,
    `isPwD` BOOLEAN NOT NULL,
    `disabilityType` VARCHAR(191) NULL,
    `disabilityPercentage` INTEGER NULL,
    `occupation` ENUM('STUDENT', 'FARMER', 'SALARIED_EMPLOYEE', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'DAILY_WAGE_WORKER', 'HOMEMAKER', 'SENIOR_CITIZEN', 'UNEMPLOYED', 'OTHER') NOT NULL,
    `isBPL` BOOLEAN NOT NULL,
    `annualIncome` ENUM('BELOW_1_LAKH', 'BETWEEN_1_TO_3_LAKH', 'BETWEEN_3_TO_5_LAKH', 'BETWEEN_5_TO_10_LAKH', 'ABOVE_10_LAKH') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `SavedSchemes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `schemeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SavedSchemes_userId_schemeId_key`(`userId`, `schemeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedSchemes` ADD CONSTRAINT `SavedSchemes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedSchemes` ADD CONSTRAINT `SavedSchemes_schemeId_fkey` FOREIGN KEY (`schemeId`) REFERENCES `Scheme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
