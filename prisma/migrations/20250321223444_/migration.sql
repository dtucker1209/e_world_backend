/*
  Warnings:

  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - Added the required column `count` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "name",
ADD COLUMN     "count" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
