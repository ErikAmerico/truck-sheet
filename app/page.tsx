import { auth } from "auth";
import { redirect } from "next/navigation";
import NavBar from "./navBar/NavBar";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "driver") {
    redirect("/trucksheet");
  }

  return (
    <main>
      {/* if put the navbar in the layout file, then the navbar will also appear on the login page */}
      <NavBar />
      <div>Hey this is the home page</div>
    </main>
  );
}
