import { auth } from "auth";
import { redirect } from "next/navigation";
import TruckTable from "./TruckTable";
import fetchTrucksFromDb from "./fetchTrucks";
import fetchTruckDriversMap from "./fetchTruckDriversMap";

export const metadata = {
  title: "Trucksheets - Truck Table",
  description: "Trucks page",
};

export default async function TrucksPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "driver") {
    redirect("/trucksheet");
  }

  const trucks = await fetchTrucksFromDb();

  const drivers = await fetchTruckDriversMap(trucks);

  return (
    <main>
      <TruckTable initialTrucks={trucks} initialDrivers={drivers} />
    </main>
  );
}
