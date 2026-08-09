-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "targetRole" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3);
