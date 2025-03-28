export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const employeeToSpinDB = await prisma.employee.findFirst();

    console.log("🌪️ spinning up DB with: ", employeeToSpinDB);
    return NextResponse.json(employeeToSpinDB, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching employee to spin up DB:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee to spin up DB" },
      { status: 500 }
    );
  }
}
