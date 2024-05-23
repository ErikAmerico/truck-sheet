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
        const { username, password } = credentials;

        try {
          // Fetch the employee from the database using Prisma
          const employee = await prisma.employee.findUnique({
            where: {
              username,
            },
          });

          if (!employee) {
            throw new Error("Employee not found.");
          }

          // Verify the provided password
          const isPasswordValid = await comparePassword(
            password,
            employee.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          // Return the necessary user data
          return {
            id: employee.id,
            username: employee.username,
            firstName: employee.firstName,
            lastName: employee.lastName,
            role: employee.role,
          };
        } catch (error) {
          console.error("Error finding employee", error);
          throw new Error(
            "Authentication failed. Please check your credentials and try again."
          );
        }
      },
    }),
  ],
  callbacks: {
    // user is used internally by NextAuth.js
    // opposed to employee which was defined as a Prisma model
    async jwt({ token, user }) {
      if (user) {
        // Populate the token with user information
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Populate the session with token information
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
