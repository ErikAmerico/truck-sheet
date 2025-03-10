import { auth } from "auth";
import { redirect } from "next/navigation";
import OfficeEmployeeTable from "./OfficeEmployeeTable";

export default async function OfficeEmployee() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "office") {
    redirect("/");
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASEURL + "/api/employees/getofficeemployees"
  );
  const officeEmployees = await response.json();

  return <main>{<OfficeEmployeeTable employees={officeEmployees} />}</main>;
}
