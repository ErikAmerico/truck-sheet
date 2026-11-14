import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { saltAndHashPassword } from "../../../../utils/saltHashPw";
import pusher from "../../../../lib/pusher";

export async function PUT(req: NextRequest) {
  const { id, firstName, lastName, username, password } = await req.json();

  try {
    const lowerCaseUsername = username.toLowerCase();

    const existingUser = await prisma.employee.findFirst({
      where: {
        username: lowerCaseUsername,
        id: { not: Number(id) },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const updateData: any = {
      firstName,
      lastName,
      username: lowerCaseUsername,
    };

    if (password) {
      const hashedPassword = await saltAndHashPassword(password);
      updateData.password = hashedPassword;
    }

    const updatedDriver = await prisma.employee.update({
      where: { id: Number(id) },
      data: updateData,
    });

    await pusher.trigger("real-time-drivers", "driver-updated", {
      updatedDriver,
    });

    return NextResponse.json(updatedDriver, { status: 200 });
  } catch (error) {
    console.error("Error updating driver:", error);
    return NextResponse.json(
      { error: "Failed to update driver" },
      { status: 500 }
    );
  }
}
