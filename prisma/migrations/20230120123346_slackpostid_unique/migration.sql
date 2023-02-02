/*
  Warnings:

  - A unique constraint covering the columns `[slackPostId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_slackPostId_key" ON "User"("slackPostId");
