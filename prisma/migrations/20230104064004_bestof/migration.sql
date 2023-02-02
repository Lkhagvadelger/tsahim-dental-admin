-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "best_of" DECIMAL(65,30) DEFAULT 1;

-- AlterTable
ALTER TABLE "UserBots" ADD COLUMN     "isFinished" TIMESTAMP(3);
