import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { saltAndHashPassword } from "../utils/saltHashPw.js";

async function main() {
  const hashedPassword = await saltAndHashPassword("Chris123.");
  const employee = await prisma.employee.upsert({
    where: { username: "chrisdas" },
    update: {},
    create: {
      role: "office",
      username: "chrisdas",
      password: hashedPassword,
      firstName: "Chris",
      lastName: "Das",
    },
  });

  console.log({ employee });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
