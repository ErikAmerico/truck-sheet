import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { saltAndHashPassword } from "../utils/saltHashPw.js";

async function main() {
  const existingEmployee = await prisma.employee.findUnique({
    where: { username: "chrisdas" },
  });
  //check if employee exists before seeding
  if (!existingEmployee) {
    const hashedPassword = await saltAndHashPassword("Chris123.");
    const employee = await prisma.employee.create({
      data: {
        role: "office",
        username: "chrisdas",
        password: hashedPassword,
        firstName: "Chris",
        lastName: "Das",
      },
    });
    console.log("Employee seeded: ", employee);
  } else {
    console.log("Employee already exists");
  }

  const existingTruck = await prisma.truck.findUnique({
    where: { number: 100 },
  });
  //check if truck exists before seeding
  if (!existingTruck) {
    const truck = await prisma.truck.create({
      data: {
        number: 100,
      },
    });
    console.log("Truck created:", truck);
  } else {
    console.log("Truck already exists, skipping creation.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
