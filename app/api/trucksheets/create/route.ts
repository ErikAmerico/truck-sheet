import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  console.log("Session:", session);

  if (!session) {
    return NextResponse.error();
  }

  const {
    date,
    fuel,
    mileage,
    truckId,
    aircompressor,
    airlines,
    battery,
    brakeaccessories,
    brakes,
    carburetor,
    clutch,
    defroster,
    driveline,
    engine,
    fueltanks,
    heater,
    horn,
    lights,
    mirrors,
    muffler,
    oilpressure,
    onboardrecorder,
    radiator,
    rearend,
    reflectors,
    safetyequipment,
    springs,
    starter,
    steering,
    tachograph,
    tires,
    transmission,
    wheels,
    windows,
    windshieldwipers,
    remarks,
  } = await req.json();

  try {
    const latestTruckSheet = await prisma.trucksheet.findFirst({
      where: { truckId },
      orderBy: { date: "desc" },
    });

    if (latestTruckSheet && mileage < latestTruckSheet.mileage) {
      return NextResponse.json(
        { error: "Mileage must be greater than the last reported value." },
        { status: 400 }
      );
    }

    const trucksheet = await prisma.trucksheet.create({
      data: {
        date: new Date(date),
        fuel,
        mileage,
        truck: {
          connect: { id: truckId },
        },
        employee: {
          connect: { id: parseInt(session.user.id, 10) },
        },
        aircompressor,
        airlines,
        battery,
        brakeaccessories,
        brakes,
        carburetor,
        clutch,
        defroster,
        driveline,
        engine,
        fueltanks,
        heater,
        horn,
        lights,
        mirrors,
        muffler,
        oilpressure,
        onboardrecorder,
        radiator,
        rearend,
        reflectors,
        safetyequipment,
        springs,
        starter,
        steering,
        tachograph,
        tires,
        transmission,
        wheels,
        windows,
        windshieldwipers,
        remarks,
      },
    });
    return NextResponse.json(trucksheet, { status: 201 });
  } catch (error) {
    console.error("Error creating truck sheet:", error);
    return NextResponse.json(
      { error: "Failed to create truck sheet" },
      { status: 500 }
    );
  }
}
