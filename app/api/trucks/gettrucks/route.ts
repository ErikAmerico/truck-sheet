// Ensures the route is always dynamically rendered, bypassing caching
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // const trucks = await prisma.truck.findMany();
    const trucks = await prisma.truck.findMany({
      include: {
        trucksheet: {
          select: {
            mileage: true,
            fuel: true,
            date: true,
            remarks: true,
            employeeId: true,
          },
        },
      },
    });

    const formattedTrucks = trucks.map((truck) => ({
      ...truck,
      trucksheet: truck.trucksheet ?? [], // ✅ Always an array, even if empty
    }));

    return NextResponse.json(formattedTrucks, { status: 200 });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucks" },
      { status: 500 }
    );
  }
}
