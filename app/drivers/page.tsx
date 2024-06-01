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

  return <main>{<DriverTable drivers={drivers} />}</main>;
}
