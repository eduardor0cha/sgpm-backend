/*
  Warnings:

  - A unique constraint covering the columns `[id,isActive]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,isActive]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,isActive]` on the table `Publication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf,isActive]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,isActive]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,isActive]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `File_id_isActive_key` ON `File`(`id`, `isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `Message_id_isActive_key` ON `Message`(`id`, `isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `Publication_id_isActive_key` ON `Publication`(`id`, `isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `User_cpf_isActive_key` ON `User`(`cpf`, `isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `User_username_isActive_key` ON `User`(`username`, `isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_isActive_key` ON `User`(`email`, `isActive`);
