import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./utils/saltHashPw";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);

        const { username, password } = credentials;

        try {
          const employee = await prisma.employee.findUnique({
            where: {
              username,
            },
          });

          if (!employee) {
            throw new Error("Employee not found.");
          }

          const isPasswordValid = await comparePassword(
            password,
            employee.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return employee;
        } catch (error) {
          console.error("Error finding employee", error);
          throw new Error(
            "Authentication failed. Please check your credentials and try again."
          );
        }
      },
    }),
  ],
});
