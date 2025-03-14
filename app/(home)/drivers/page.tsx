import { auth } from "auth";
import { redirect } from "next/navigation";
import DriverTable from "./DriverTable";
import fetchDriversAndLatestTruckSheet from "./fetchDrivers";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../muiTheme";

export const metadata = {
  title: "Trucksheets - Driver Table",
  description: "Drivers page",
};

export default async function Drivers() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "office") {
    redirect("/");
  }

  const formattedDrivers = await fetchDriversAndLatestTruckSheet();

  return (
    <ThemeProvider theme={theme}>
      <main>{<DriverTable initialDrivers={formattedDrivers} />}</main>
    </ThemeProvider>
  );
}
