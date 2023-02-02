-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isGptFlagged" BOOLEAN DEFAULT false,
ADD COLUMN     "isUserFlagged" BOOLEAN DEFAULT false,
ADD COLUMN     "userModeration" TEXT;
