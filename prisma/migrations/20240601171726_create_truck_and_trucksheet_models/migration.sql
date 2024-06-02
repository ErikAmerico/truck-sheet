-- CreateTable
CREATE TABLE "truck" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trucksheet" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "truckId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "aircompressor" BOOLEAN,
    "airlines" BOOLEAN,
    "battery" BOOLEAN,
    "brakeaccessories" BOOLEAN,
    "brakes" BOOLEAN,
    "carburetor" BOOLEAN,
    "clutch" BOOLEAN,
    "defroster" BOOLEAN,
    "driveline" BOOLEAN,
    "engine" BOOLEAN,
    "fueltanks" BOOLEAN,
    "heater" BOOLEAN,
    "horn" BOOLEAN,
    "lights" BOOLEAN,
    "mirrors" BOOLEAN,
    "muffler" BOOLEAN,
    "oilpressure" BOOLEAN,
    "onboardrecorder" BOOLEAN,
    "radiator" BOOLEAN,
    "rearend" BOOLEAN,
    "reflectors" BOOLEAN,
    "safetyequipment" BOOLEAN,
    "springs" BOOLEAN,
    "starter" BOOLEAN,
    "tachograph" BOOLEAN,
    "tires" BOOLEAN,
    "transmission" BOOLEAN,
    "wheels" BOOLEAN,
    "windshieldwipers" BOOLEAN,
    "other" BOOLEAN,
    "fuel" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "furniturepads" BOOLEAN,
    "burlapskins" BOOLEAN,
    "humpstraps" BOOLEAN,
    "estraps" BOOLEAN,
    "bucklestraps" BOOLEAN,
    "doorstops" BOOLEAN,
    "blocks" BOOLEAN,
    "fireextinguisher" BOOLEAN,
    "setofreflectors" BOOLEAN,
    "setofjumpercables" BOOLEAN,
    "bigred" BOOLEAN,
    "steelplate" BOOLEAN,
    "diamondplate" BOOLEAN,
    "rubberbands" BOOLEAN,
    "remarks" TEXT,
    "trashremove" BOOLEAN,
    "conditionsatisfactory" BOOLEAN,
    "defectscorrected" BOOLEAN,
    "defectsneednocorrection" BOOLEAN,

    CONSTRAINT "trucksheet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trucksheet" ADD CONSTRAINT "trucksheet_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trucksheet" ADD CONSTRAINT "trucksheet_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
