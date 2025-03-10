import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Truck ID is required" },
        { status: 400 }
      );
    }

    //delete all truck sheets associated with this truck
    await prisma.trucksheet.deleteMany({
      where: { truckId: id },
    });

    //delete the truck
    await prisma.truck.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Truck deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting truck:", error);
    return NextResponse.json(
      { error: "Failed to delete truck" },
      { status: 500 }
    );
  }
}
