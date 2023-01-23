/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `confirmAccountToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `resetEmailToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `resetPasswordToken` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `confirmAccountToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `resetEmailToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `resetPasswordToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `confirmAccountToken` DROP COLUMN `expiredAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `resetEmailToken` DROP COLUMN `expiredAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `resetPasswordToken` DROP COLUMN `expiredAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
