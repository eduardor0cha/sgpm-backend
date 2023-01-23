-- AlterTable
ALTER TABLE `User` ADD COLUMN `confirmedAccount` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `confirmAccountToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `confirmAccountToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resetPasswordToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resetPasswordToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `confirmAccountToken` ADD CONSTRAINT `confirmAccountToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resetPasswordToken` ADD CONSTRAINT `resetPasswordToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
