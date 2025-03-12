import { auth } from "auth";
import { redirect } from "next/navigation";
import TruckTable from "./TruckTable";
import fetchTrucks from "./fetchTrucks";

export default async function TrucksPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "driver") {
    redirect("/trucksheet");
  }

  const trucks = await fetchTrucks();

  const fetchDrivers = async () => {
    // Get unique employee IDs from the trucks data
    const driverIds: number[] = [];
    trucks.forEach((truck: any) => {
      truck.trucksheet.forEach((sheet: any) => {
        if (sheet.employeeId && !driverIds.includes(sheet.employeeId)) {
          // Ensuring employeeId is valid (not null/undefined) and unique before adding
          driverIds.push(sheet.employeeId);
        }
      });
    });

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASEURL + `/api/employees/getdrivers`,
      { cache: "no-store" }
    );
    const allDrivers = await response.json();

    // Filter only the needed drivers
    const driverDetails: any[] = allDrivers.filter((driver: any) =>
      driverIds.includes(driver.id)
    );

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
