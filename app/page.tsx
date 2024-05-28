import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <div>Hey this is the home page</div>
    </main>
  );
}
