/*
  Warnings:

  - You are about to drop the `_MyRelationTable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,itemId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_MyRelationTable" DROP CONSTRAINT "_MyRelationTable_A_fkey";

-- DropForeignKey
ALTER TABLE "_MyRelationTable" DROP CONSTRAINT "_MyRelationTable_B_fkey";

-- DropTable
DROP TABLE "_MyRelationTable";

-- CreateTable
CREATE TABLE "_CartItemRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CartItemRelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CartItemRelation_B_index" ON "_CartItemRelation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_itemId_key" ON "Review"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "_CartItemRelation" ADD CONSTRAINT "_CartItemRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemRelation" ADD CONSTRAINT "_CartItemRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
