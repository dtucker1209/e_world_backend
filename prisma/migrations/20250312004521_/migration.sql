/*
  Warnings:

  - You are about to drop the `_CartItemRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartItemRelation" DROP CONSTRAINT "_CartItemRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemRelation" DROP CONSTRAINT "_CartItemRelation_B_fkey";

-- DropIndex
DROP INDEX "Review_userId_itemId_key";

-- DropTable
DROP TABLE "_CartItemRelation";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_itemId_key" ON "CartItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_itemId_key" ON "CartItem"("cartId", "itemId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
