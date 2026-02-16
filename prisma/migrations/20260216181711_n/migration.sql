-- CreateEnum
CREATE TYPE "DeveloperStatus" AS ENUM ('AVAILABLE', 'LIMITED', 'IN_PROGRESS', 'FULLY_BOOKED', 'ON_VACATION', 'NOT_AVAILABLE');

-- AlterTable
ALTER TABLE "ProfileInformation" ADD COLUMN     "status" "DeveloperStatus" NOT NULL DEFAULT 'AVAILABLE';
