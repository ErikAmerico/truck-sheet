import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./utils/saltHashPw";
import { prisma } from "./lib/prisma";

declare module "next-auth" {
  //extending properties for the user object
  interface User {
    // having trouble getting the id
    // to match types across the app
    // id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    email?: string | null | undefined;
    emailVerified?: Date | null | undefined;
  }

  interface Session {
    // extending properties for the session object
    user: {
      // id: number;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      email?: string | null | undefined;
      emailVerified?: Date | null | undefined;
    };
  }

  interface JWT {
    // extending properties for the JWT object
    // id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    email?: string | null | undefined;
    emailVerified?: Date | null | undefined;
  }
}

const config = {
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
            where: { username: username as string },
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

          // Return the necessary user data
          return {
            id: employee.id.toString(),
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
        //These email fields are not in the Prisma model
        //AdaperUser requires these properties
        //keep looking into this
        token.email = user.email;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Assert the type of session.user
        session.user = {
          id: token.id as string,
          username: token.username as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          role: token.role as string,
          //These email fields are not in the Prisma model
          //AdaperUser requires these properties
          //keep looking into this
          email: token.email as string,
          emailVerified: token.emailVerified as Date,
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
