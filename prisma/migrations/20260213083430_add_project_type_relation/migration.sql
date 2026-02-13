/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `ProjectType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `typeId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_title_key" ON "ProjectType"("title");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProjectType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
