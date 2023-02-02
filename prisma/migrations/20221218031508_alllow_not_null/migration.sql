/*
  Warnings:

  - Made the column `summarizePrompt` on table `Bot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finisherPrompt` on table `Bot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "summarizePrompt" SET NOT NULL,
ALTER COLUMN "finisherPrompt" SET NOT NULL;
