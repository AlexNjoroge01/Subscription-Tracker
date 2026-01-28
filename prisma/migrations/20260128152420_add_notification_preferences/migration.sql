-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyDigestEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyBudgetWarning" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOneDay" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOverdue" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySevenDays" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyThreeDays" BOOLEAN NOT NULL DEFAULT true;
