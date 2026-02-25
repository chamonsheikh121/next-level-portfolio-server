-- CreateEnum
CREATE TYPE "ClientProjectStatus" AS ENUM ('Pending', 'In Progress', 'Delivered', 'Overdue');

-- CreateEnum
CREATE TYPE "ClientProjectPhase" AS ENUM ('Analysis', 'UI/UX Design', 'Backend', 'Frontend', 'Integration', 'DevOps', 'Maintenance');

-- CreateTable
CREATE TABLE "client_project_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_projects" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "status" "ClientProjectStatus" NOT NULL DEFAULT 'Pending',
    "phase" "ClientProjectPhase" NOT NULL DEFAULT 'Analysis',
    "deadline" TIMESTAMP(3) NOT NULL,
    "budget" DECIMAL(12,2) NOT NULL,
    "projectDetailsLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "client_projects" ADD CONSTRAINT "client_projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "client_project_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
