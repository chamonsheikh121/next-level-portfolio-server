/*
  Warnings:

  - You are about to drop the `HireRequestFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HireRequestFile" DROP CONSTRAINT "HireRequestFile_fileId_fkey";

-- DropForeignKey
ALTER TABLE "HireRequestFile" DROP CONSTRAINT "HireRequestFile_hireRequestId_fkey";

-- AlterTable
ALTER TABLE "FileDocument" ADD COLUMN     "hireRequestId" INTEGER;

-- DropTable
DROP TABLE "HireRequestFile";

-- AddForeignKey
ALTER TABLE "FileDocument" ADD CONSTRAINT "FileDocument_hireRequestId_fkey" FOREIGN KEY ("hireRequestId") REFERENCES "HireRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
