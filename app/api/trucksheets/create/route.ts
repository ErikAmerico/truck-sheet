import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "../../../../lib/prisma";
import pusher from "../../../../lib/pusher";

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
    furniturepads,
    burlapskins,
    humpstraps,
    estraps,
    bucklestraps,
    doorstops,
    blocks,
    fireextinguisher,
    setofreflectors,
    setofjumpercables,
    bigred,
    steelplate,
    diamondplate,
    rubberbands,
    trashremove,
    conditionsatisfactory,
    defectscorrected,
    defectsneednocorrection,
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
        furniturepads,
        burlapskins,
        humpstraps,
        estraps,
        bucklestraps,
        doorstops,
        blocks,
        fireextinguisher,
        setofreflectors,
        setofjumpercables,
        bigred,
        steelplate,
        diamondplate,
        rubberbands,
        trashremove,
        conditionsatisfactory,
        defectscorrected,
        defectsneednocorrection,
        remarks,
      },
    });

    //__________________________________________________________________________________________________________//
    //Pusher Event

    //emits a real time event using Pusher.
    //triggers an event that informs subscribed clients about an update
    //real-time-trucks is the channel name, Clients subscribe to this exact channel to receive the event.
    //new-trucksheet is the event name, Clients listen for this specific event.
    //trucksheet is the data that will be sent to the clients, Contains the newly created trucksheet object.

    // Step 1: Server Sends the Event
    // The backend calls pusher.trigger() after creating a trucksheet.
    // Pusher publishes the event to its cloud servers.

    // Step 2: Pusher Cloud Distributes the Event
    // Pusher's cloud service routes the event to all clients subscribed to "real-time-trucks".

    // Step 3: Clients Receive the Event
    // On the frontend, a React component using pusher-js is listening:

    // The client subscribes to "real-time-trucks".
    // When "new-trucksheet" is emitted, the callback function updates the UI.
    await pusher.trigger("real-time-trucks", "new-trucksheet", {
      trucksheet,
    });
    //__________________________________________________________________________________________________________//

    return NextResponse.json(trucksheet, { status: 201 });
  } catch (error) {
    console.error("Error creating truck sheet:", error);
    return NextResponse.json(
      { error: "Failed to create truck sheet" },
      { status: 500 }
    );
  }
}
