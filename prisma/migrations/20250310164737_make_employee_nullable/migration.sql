-- DropForeignKey
ALTER TABLE "trucksheet" DROP CONSTRAINT "trucksheet_employeeId_fkey";

-- AlterTable
ALTER TABLE "trucksheet" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "trucksheet" ADD CONSTRAINT "trucksheet_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
