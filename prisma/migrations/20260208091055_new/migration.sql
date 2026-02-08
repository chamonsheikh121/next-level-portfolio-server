-- CreateTable
CREATE TABLE "Award" (
    "id" SERIAL NOT NULL,
    "imageURL" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "awardFrom" TEXT,
    "awardDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "blocks" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileDocument" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER,
    "blocks" JSONB NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "FileDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "imageURL" TEXT,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "location" TEXT,
    "graduationDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "imageURL" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endingDate" TIMESTAMP(3),
    "description" TEXT,
    "keyAchievements" TEXT[],
    "technologies" TEXT[],

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HireRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "linkedinUrl" TEXT,
    "notes" TEXT,
    "projectDesc" TEXT,
    "serviceId" INTEGER,
    "estimateBudget" TEXT,
    "expectedTimeline" TEXT,
    "coreFeatures" TEXT[],
    "techSuggestion" TEXT[],

    CONSTRAINT "HireRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HireRequestFile" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "hireRequestId" INTEGER NOT NULL,

    CONSTRAINT "HireRequestFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpmType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "NpmType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpmPackage" (
    "id" SERIAL NOT NULL,
    "npmTypeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "liveURL" TEXT,
    "githubUrl" TEXT,
    "installable" TEXT,
    "tags" TEXT[],

    CONSTRAINT "NpmPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInformation" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "description" TEXT,
    "resumeURL" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "workingHour" TEXT,

    CONSTRAINT "ProfileInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageURL" TEXT,
    "frontendTechs" TEXT[],
    "backendTechs" TEXT[],
    "devopsTechs" TEXT[],
    "designTechs" TEXT[],
    "othersTechs" TEXT[],
    "keyAccomplishments" TEXT[],
    "projectOverview" TEXT,
    "problems" JSONB NOT NULL,
    "solutions" JSONB NOT NULL,
    "solutionArchitecture" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "timeline" TEXT,
    "role" TEXT,
    "totalMemberWorked" INTEGER,
    "outcome" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "bulletPoints" TEXT[],
    "coreTechStacks" TEXT[],

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" SERIAL NOT NULL,
    "imageURL" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkFlow" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,

    CONSTRAINT "WorkFlow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HireRequestFile" ADD CONSTRAINT "HireRequestFile_hireRequestId_fkey" FOREIGN KEY ("hireRequestId") REFERENCES "HireRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpmPackage" ADD CONSTRAINT "NpmPackage_npmTypeId_fkey" FOREIGN KEY ("npmTypeId") REFERENCES "NpmType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
