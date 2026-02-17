-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('unread', 'read', 'archived');

-- CreateTable
CREATE TABLE "user_message" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_message_pkey" PRIMARY KEY ("id")
);
