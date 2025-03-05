/*
  Warnings:

  - You are about to drop the `_CartToItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartToItem" DROP CONSTRAINT "_CartToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToItem" DROP CONSTRAINT "_CartToItem_B_fkey";

-- DropTable
DROP TABLE "_CartToItem";

-- CreateTable
CREATE TABLE "_MyRelationTable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MyRelationTable_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MyRelationTable_B_index" ON "_MyRelationTable"("B");

-- AddForeignKey
ALTER TABLE "_MyRelationTable" ADD CONSTRAINT "_MyRelationTable_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MyRelationTable" ADD CONSTRAINT "_MyRelationTable_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
