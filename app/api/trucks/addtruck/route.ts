import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  const { number } = await req.json();

  try {
    const newTruck = await prisma.truck.create({
      data: {
        number,
      },
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
