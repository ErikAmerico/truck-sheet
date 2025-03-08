import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { saltAndHashPassword } from "../../../../utils/saltHashPw";

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

    const updatedOfficeEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedOfficeEmployee, { status: 200 });
  } catch (error) {
    console.error("Error updating office employee:", error);
    return NextResponse.json(
      { error: "Failed to update office employee" },
      { status: 500 }
    );
  }
}
