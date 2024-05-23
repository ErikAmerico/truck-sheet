import { PrismaClient } from "@prisma/client";

// Attach PrismaClient to the global object to prevent exhausting the database connection limit in development

const globalForPrisma = globalThis;

// check the global object to see if prisma has already been attached
// if it does, use the existing prisma instance
const prisma =
  globalForPrisma.prisma ||
  // if it doesn't, create a new prisma instance
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
