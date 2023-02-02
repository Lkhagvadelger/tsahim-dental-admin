-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isFinished" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "shouldFinish" BOOLEAN DEFAULT false;
