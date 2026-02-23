-- AlterTable
ALTER TABLE "PaymentPlan" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planEndsAt" TIMESTAMP(3),
ADD COLUMN     "planId" TEXT DEFAULT 'starter-plan',
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PaymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
