/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEndDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId",
DROP COLUMN "subscriptionEndDate";
