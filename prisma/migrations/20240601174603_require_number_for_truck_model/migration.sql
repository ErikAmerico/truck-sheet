/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `truck` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "truck_number_key" ON "truck"("number");
