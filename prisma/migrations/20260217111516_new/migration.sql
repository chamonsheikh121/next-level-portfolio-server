-- AlterEnum
-- Step 1: Add the new enum value (must be done first and committed)
ALTER TYPE "HireRequestStatus" ADD VALUE IF NOT EXISTS 'inprocess';
