import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const trucks = await prisma.truck.findMany();
    return NextResponse.json(trucks, { status: 200 });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucks" },
      { status: 500 }
    );
  }
}
