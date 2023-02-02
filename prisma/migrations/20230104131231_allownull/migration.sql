-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "summarizePrompt" DROP NOT NULL,
ALTER COLUMN "finisherPrompt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserBots" ADD COLUMN     "nextMessageHour" TEXT;
