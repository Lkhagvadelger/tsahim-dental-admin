-- CreateTable
CREATE TABLE "UserBots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "botSeedData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBots" ADD CONSTRAINT "UserBots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBots" ADD CONSTRAINT "UserBots_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
