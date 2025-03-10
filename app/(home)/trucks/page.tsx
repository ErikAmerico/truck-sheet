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

  //get trucks instead of lastest trucksheets
  //in trucktable, we will just get the last trucksheet
  //in each trucks trucksheet array
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASEURL + "/api/trucks/gettrucks",
    // Allegedly Prevents caching to always fetch the latest data
    { cache: "no-store" }
  );
  const trucks = await response.json();

  const fetchDrivers = async () => {
    // Get unique employee IDs from the trucks data
    const driverIds: number[] = [];
    trucks.forEach((truck: any) => {
      truck.trucksheet.forEach((sheet: any) => {
        if (!driverIds.includes(sheet.employeeId)) {
          driverIds.push(sheet.employeeId);
        }
      });
    });

    // Fetch driver details for each unique ID
    const driverDetails: any[] = [];
    for (let id of driverIds) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASEURL + `/api/employees/getdriver?id=${id}`,
        // Allegedly Prevents caching to always fetch the latest data
        { cache: "no-store" }
      );
      const data = await response.json();
      driverDetails.push(data);
    }

    // Create a map of driver IDs to driver names
    const drivers: { [key: number]: string } = {};
    driverDetails.forEach((driver) => {
      if (driver && driver.id) {
        drivers[driver.id] = `${driver.firstName} ${driver.lastName}`;
      }
    });

    return drivers;
  };

  const drivers = await fetchDrivers();

  return (
    <main>
      <TruckTable initialTrucks={trucks} drivers={drivers} />
    </main>
  );
}
