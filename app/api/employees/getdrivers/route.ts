//Ensures the route is always dynamically rendered, bypassing caching
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const drivers = await prisma.employee.findMany({
      where: {
        role: "driver",
      },
      include: {
        trucksheet: true,
      },
    });
    return NextResponse.json(drivers, { status: 200 });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}
