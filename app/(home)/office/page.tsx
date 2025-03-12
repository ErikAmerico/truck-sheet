import { auth } from "auth";
import { redirect } from "next/navigation";
import OfficeEmployeeTable from "./OfficeEmployeeTable";
import fetchOfficeEmployees from "./fetchOfficeEmployees";

export const metadata = {
  title: "Trucksheets - Office Table",
  description: "Office page",
};

export default async function OfficeEmployee() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "office") {
    redirect("/");
  }

  const officeEmployees = await fetchOfficeEmployees();

  return (
    <main>{<OfficeEmployeeTable initialEmployees={officeEmployees} />}</main>
  );
}
