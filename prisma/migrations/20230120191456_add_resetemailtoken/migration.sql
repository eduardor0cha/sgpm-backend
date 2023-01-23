-- CreateTable
CREATE TABLE `resetEmailToken` (
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resetEmailToken_token_key`(`token`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resetEmailToken` ADD CONSTRAINT `resetEmailToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
