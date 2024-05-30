import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { saltAndHashPassword } from "../../../../utils/saltHashPw";

export async function POST(req: NextRequest) {
  const { username, password, firstName, lastName, role } = await req.json();

  try {
    const hashedPassword = await saltAndHashPassword(password);

    const newDriver = await prisma.employee.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role: "driver",
      },
    });

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 }
    );
  }
}
