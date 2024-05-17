import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const employee = await prisma.employee.upsert({
    where: { username: "chrisdas" },
    update: {},
    create: {
      role: "office",
      username: "chrisdas",
      password: "Chris123.",
      firstName: "Chris",
      lastName: "Das",
    },
  });

  console.log({ employee });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
    });
  
