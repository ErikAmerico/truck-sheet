import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const trucks = await prisma.truck.findMany({
      include: {
        trucksheet: {
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    });
    return NextResponse.json(trucks, { status: 200 });
  } catch (error) {
    console.error("Error fetching trucksheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucksheets" },
      { status: 500 }
    );
  }
}
