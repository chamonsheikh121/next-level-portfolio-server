-- AlterTable
-- Step 2: Now that 'inprocess' exists, set it as the default
ALTER TABLE "HireRequest" ALTER COLUMN "status" SET DEFAULT 'inprocess';
