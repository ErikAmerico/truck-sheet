import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function TrucksPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "driver") {
    redirect("/trucksheet");
  }

  return (
    <main>
      <div>Hey this is the Trucks page</div>
    </main>
  );
}
