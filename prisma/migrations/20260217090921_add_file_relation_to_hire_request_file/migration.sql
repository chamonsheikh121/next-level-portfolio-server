-- DropForeignKey
ALTER TABLE "HireRequestFile" DROP CONSTRAINT "HireRequestFile_hireRequestId_fkey";

-- AddForeignKey
ALTER TABLE "HireRequestFile" ADD CONSTRAINT "HireRequestFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HireRequestFile" ADD CONSTRAINT "HireRequestFile_hireRequestId_fkey" FOREIGN KEY ("hireRequestId") REFERENCES "HireRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
