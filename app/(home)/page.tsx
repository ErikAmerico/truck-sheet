import { auth } from "auth";
import { redirect } from "next/navigation";
import HomePageContent from "./HomePage";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user?.role === "driver") {
    redirect("/trucksheet");
  }

  return (
    <main>
      <HomePageContent />
    </main>
  );
}
