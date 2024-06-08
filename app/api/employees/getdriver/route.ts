import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Extract id from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check if id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Fetch driver by id
    const driver = await prisma.employee.findFirst({
      where: {
        id: parseInt(id, 10),
        role: "driver",
      },
    });

    // Check if driver is found
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json(driver, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver" },
      { status: 500 }
    );
  }
}
