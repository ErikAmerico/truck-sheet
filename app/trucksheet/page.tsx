import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function TruckSheet() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "driver") {
    redirect("/");
  }

  return (
    <div id="trucksheet-page-container">
      <h1>Truck SHeet page</h1>
    </div>
  );
}
