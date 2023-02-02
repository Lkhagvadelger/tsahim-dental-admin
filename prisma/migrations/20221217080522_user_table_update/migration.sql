/*
  Warnings:

  - You are about to drop the column `isActive` on the `Bots` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bots" DROP COLUMN "isActive",
ADD COLUMN     "stopSequences" TEXT[],
ALTER COLUMN "model" SET DEFAULT E'text-davinci-003',
ALTER COLUMN "temperature" SET DEFAULT 0.1,
ALTER COLUMN "max_tokens" SET DEFAULT 255,
ALTER COLUMN "top_p" SET DEFAULT 1,
ALTER COLUMN "frequency_penalty" SET DEFAULT 0,
ALTER COLUMN "presence_penalty" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "plateNumber";
