import { auth } from "auth";
import { redirect } from "next/navigation";
import TruckTable from "./TruckTable";

export default async function TrucksPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "driver") {
    redirect("/trucksheet");
  }

  const response = await fetch(
    "http://localhost:3000/api/trucksheets/getlatesttrucksheets"
  );
  const trucks = await response.json();

  return <main>{<TruckTable trucks={trucks} />}</main>;
}
