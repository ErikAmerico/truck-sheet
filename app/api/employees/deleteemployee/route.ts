import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    // Check if the employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Set employeeId to NULL in trucksheet before deleting the employee
    await prisma.trucksheet.updateMany({
      where: { employeeId: id },
      data: { employeeId: null },
    });

    // Delete the employee (office or driver)
    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: `${employee.role} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
