"use server";
import { signIn } from "auth";
import { redirect } from "next/navigation";

export default async function SignIn(username: string, password: string) {
  await signIn("credentials", {
    username,
    password,
  });
  redirect("/");
}
