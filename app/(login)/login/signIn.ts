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

    return result;
  } catch (error) {
    console.log("error signing in:", error);
    return { error: "Invalid username or password!" };
  }
}
