import { auth } from "auth";
import { redirect } from "next/navigation";
import DriverTable from "./DriverTable";

export default async function Drivers() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "office") {
    redirect("/");
  }

  const response = await fetch(
    "http://localhost:3000/api/employees/getdrivers"
  );
  const drivers = await response.json();

  const trucksResponse = await fetch(
    "http://localhost:3000/api/trucks/gettrucks"
  );
  const trucks = await trucksResponse.json();

  const truckMap = trucks.reduce(
    (map: { [key: string]: string }, truck: any) => {
      map[truck.id] = truck.number;
      return map;
    },
    {}
  );

  const formattedDrivers = drivers.map((driver: any) => {
    const lastSheet = driver.trucksheet[driver.trucksheet.length - 1];
    const lastReport = lastSheet
      ? {
          date: new Date(lastSheet.date).toLocaleDateString(),
          truckNumber: truckMap[lastSheet.truckId] || "Unknown",
        }
      : null;

    return {
      ...driver,
      lastReport,
    };
  });

  return <main>{<DriverTable drivers={formattedDrivers} />}</main>;
}
