/*
  Warnings:

  - You are about to drop the column `image` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemImage` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemTitle` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "image",
DROP COLUMN "title",
ADD COLUMN     "itemImage" TEXT NOT NULL,
ADD COLUMN     "itemTitle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_image_key" ON "Item"("image");
