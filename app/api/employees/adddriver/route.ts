import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { saltAndHashPassword } from "../../../../utils/saltHashPw";

export async function POST(req: NextRequest) {
  const { username, password, firstName, lastName, role } = await req.json();

  try {
    const hashedPassword = await saltAndHashPassword(password);
    const lowerCaseUsername = username.toLowerCase();

    const existingUser = await prisma.employee.findUnique({
      where: { username: lowerCaseUsername },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const newDriver = await prisma.employee.create({
      data: {
        username: lowerCaseUsername,
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
