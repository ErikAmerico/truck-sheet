-- DropForeignKey
ALTER TABLE "trucksheet" DROP CONSTRAINT "trucksheet_truckId_fkey";

-- AddForeignKey
ALTER TABLE "trucksheet" ADD CONSTRAINT "trucksheet_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
