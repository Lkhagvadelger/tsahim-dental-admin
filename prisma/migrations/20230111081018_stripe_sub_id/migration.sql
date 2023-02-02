/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Payer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payer_stripeSubscriptionId_key" ON "Payer"("stripeSubscriptionId");
