import { auth } from "auth";
import { redirect } from "next/navigation";
import DriverTable from "./DriverTable";
import fetchDriversAndLatestTruckSheet from "./fetchDrivers";

export default async function Drivers() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "office") {
    redirect("/");
  }

  const formattedDrivers = await fetchDriversAndLatestTruckSheet();

  return <main>{<DriverTable initialDrivers={formattedDrivers} />}</main>;
}
