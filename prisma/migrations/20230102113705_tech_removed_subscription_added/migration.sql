/*
  Warnings:

  - The values [TECH] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('recurring', 'one_time');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');

-- CreateEnum
CREATE TYPE "PriceInterval" AS ENUM ('day', 'month', 'week', 'year');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timeZone" TEXT;

-- CreateTable
CREATE TABLE "Payer" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeCurrentPeriodEnd" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL,
    "interval" "PriceInterval",
    "unitAmount" DECIMAL(65,30),
    "intervalCount" INTEGER,
    "trialPeriodDays" INTEGER,
    "type" "PriceType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "priceId" TEXT,
    "status" "SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "cancelAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN,
    "canceledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPayer_AB_unique" ON "_UserPayer"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPayer_B_index" ON "_UserPayer"("B");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPayer" ADD FOREIGN KEY ("A") REFERENCES "Payer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPayer" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
