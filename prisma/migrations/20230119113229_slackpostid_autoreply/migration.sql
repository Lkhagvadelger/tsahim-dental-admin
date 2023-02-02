-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoReply" BOOLEAN DEFAULT true,
ADD COLUMN     "slackPostId" TEXT;
