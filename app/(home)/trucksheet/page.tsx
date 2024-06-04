import { auth } from "auth";
import { redirect } from "next/navigation";
import TruckSheetForm from "./form";

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
      <TruckSheetForm />
    </div>
  );
}
