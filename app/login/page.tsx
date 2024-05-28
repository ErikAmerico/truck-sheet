import { auth } from "auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";
import "./page.css";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div id="login-page-container">
      <video autoPlay muted loop id="login-page-video">
        <source src="/Trucks.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div id="login-form-wrapper">
        <LoginForm />
      </div>
    </div>
  );
}
