import { auth } from "auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div>
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
