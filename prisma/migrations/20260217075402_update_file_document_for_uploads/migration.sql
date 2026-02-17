/*
  Warnings:

  - Added the required column `updatedAt` to the `FileDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HireRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HireRequestStatus" AS ENUM ('unread', 'read', 'archived');

-- AlterTable
ALTER TABLE "FileDocument" ADD COLUMN     "bytes" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "resourceType" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "blocks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HireRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "HireRequestStatus" NOT NULL DEFAULT 'unread',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
