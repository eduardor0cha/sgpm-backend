/*
  Warnings:

  - You are about to drop the `confirmAccountToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resetEmailToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resetPasswordToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `confirmAccountToken` DROP FOREIGN KEY `confirmAccountToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `resetEmailToken` DROP FOREIGN KEY `resetEmailToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `resetPasswordToken` DROP FOREIGN KEY `resetPasswordToken_userId_fkey`;

-- DropTable
DROP TABLE `confirmAccountToken`;

-- DropTable
DROP TABLE `resetEmailToken`;

-- DropTable
DROP TABLE `resetPasswordToken`;

-- CreateTable
CREATE TABLE `AccountConfirmationToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AccountConfirmationToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailResetToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailResetToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountConfirmationToken` ADD CONSTRAINT `AccountConfirmationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailResetToken` ADD CONSTRAINT `EmailResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
