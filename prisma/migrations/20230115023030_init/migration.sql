-- CreateTable
CREATE TABLE `User` (
    `cpf` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NULL,
    `stateId` INTEGER NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `stateAcronym` VARCHAR(191) NOT NULL,
    `cityId` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `profilePic` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`cpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Moderator` (
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medic` (
    `userId` VARCHAR(191) NOT NULL,
    `crm` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Medic_crm_key`(`crm`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Duty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `workload` INTEGER NOT NULL,
    `startingTime` DATETIME(3) NOT NULL,
    `accepted` BOOLEAN NOT NULL,
    `concluded` BOOLEAN NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `medicId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SwapRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `complainantId` VARCHAR(191) NOT NULL,
    `respondentId` VARCHAR(191) NOT NULL,
    `dutyId1` INTEGER NOT NULL,
    `dutyId2` INTEGER NOT NULL,
    `accepted` BOOLEAN NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`publicationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `publicationId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`publicationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `bytes` LONGBLOB NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `File_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Moderator` ADD CONSTRAINT `Moderator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medic` ADD CONSTRAINT `Medic_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Duty` ADD CONSTRAINT `Duty_medicId_fkey` FOREIGN KEY (`medicId`) REFERENCES `Medic`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SwapRequest` ADD CONSTRAINT `SwapRequest_complainantId_fkey` FOREIGN KEY (`complainantId`) REFERENCES `Medic`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SwapRequest` ADD CONSTRAINT `SwapRequest_respondentId_fkey` FOREIGN KEY (`respondentId`) REFERENCES `Medic`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SwapRequest` ADD CONSTRAINT `SwapRequest_dutyId1_fkey` FOREIGN KEY (`dutyId1`) REFERENCES `Duty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SwapRequest` ADD CONSTRAINT `SwapRequest_dutyId2_fkey` FOREIGN KEY (`dutyId2`) REFERENCES `Duty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`publicationId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Medic`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Medic`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
