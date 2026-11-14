import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import pusher from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const { number } = await req.json();

  try {
    const existingTruck = await prisma.truck.findUnique({
      where: { number },
    });

    if (existingTruck) {
      return NextResponse.json(
        { error: "Truck number already exists" },
        { status: 400 }
      );
    }

    const newTruck = await prisma.truck.create({
      data: {
        number,
      },
    });

    await pusher.trigger("real-time-trucks", "truck-added", {
      newTruck,
    });

    return NextResponse.json(newTruck, { status: 201 });
  } catch (error) {
    console.error("Error creating truck:", error);
    return NextResponse.json(
      { error: "Failed to create truck" },
      { status: 500 }
    );
  }
}
