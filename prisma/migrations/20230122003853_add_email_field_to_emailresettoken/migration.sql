/*
  Warnings:

  - Added the required column `email` to the `EmailResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmailResetToken` ADD COLUMN `email` VARCHAR(191) NOT NULL;
