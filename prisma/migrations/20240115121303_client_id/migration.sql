/*
  Warnings:

  - You are about to drop the `_ClientToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClientToUser" DROP CONSTRAINT "_ClientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToUser" DROP CONSTRAINT "_ClientToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientId" TEXT;

-- DropTable
DROP TABLE "_ClientToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
