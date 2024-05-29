"use server";
import { signIn } from "auth";
import { redirect } from "next/navigation";

export default async function SignIn(username: string, password: string) {
  const lowerCaseUsername = username.toLowerCase();
  await signIn("credentials", {
    username: lowerCaseUsername,
    password,
  });
  redirect("/");
}
