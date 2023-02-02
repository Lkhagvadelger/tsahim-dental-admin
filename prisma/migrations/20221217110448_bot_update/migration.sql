/*
  Warnings:

  - You are about to drop the `Bots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Bots";

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT E'text-davinci-003',
    "initialPrompt" TEXT NOT NULL,
    "summarizePrompt" TEXT,
    "finisherPrompt" TEXT,
    "temperature" DECIMAL(65,30) NOT NULL DEFAULT 0.1,
    "max_tokens" DECIMAL(65,30) NOT NULL DEFAULT 255,
    "top_p" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "frequency_penalty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "presence_penalty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "stopSequences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);
