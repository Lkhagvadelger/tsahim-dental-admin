-- CreateTable
CREATE TABLE "Bots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "initialPrompt" TEXT NOT NULL,
    "temperature" DECIMAL(65,30) NOT NULL,
    "max_tokens" DECIMAL(65,30) NOT NULL,
    "top_p" DECIMAL(65,30) NOT NULL,
    "frequency_penalty" DECIMAL(65,30) NOT NULL,
    "presence_penalty" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bots_pkey" PRIMARY KEY ("id")
);
