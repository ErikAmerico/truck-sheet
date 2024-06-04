"use server";
import { signIn } from "auth";

export default async function SignIn(username: string, password: string) {
  const lowerCaseUsername = username.toLowerCase();
  try {
    const result = await signIn("credentials", {
      username: lowerCaseUsername,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    throw new Error("Invalid username or password.");
  }
}
