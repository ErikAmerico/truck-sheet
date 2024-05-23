// use the global prisma instance defined in lib/prisma.js
// instead of  import { PrismaClient } from '@prisma/client';
// which would create a new instance of PrismaClient
import prisma from "../lib/prisma";

export default async function Page() {
  // just testing out the usage of prisma in a page
  const employee = await prisma.employee.findUnique({
    where: {
      // usernames are marked as unique in the schema
      // so using findUnique is safe
      username: "chrisdas",
    },
  });

  console.log({ employee });
  // use the main as the outermost tag
  return <main>Hello, {employee?.firstName}</main>;
}
