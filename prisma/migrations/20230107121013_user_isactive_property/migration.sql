-- AlterTable
ALTER TABLE "User" ADD COLUMN     "disabledReason" TEXT,
ADD COLUMN     "isActive" BOOLEAN DEFAULT true;
