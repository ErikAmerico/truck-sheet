import "../globals.css";
import NavBar from "../(home)/components/navBar/NavBar";
import DynamicBody from "../(home)/_utils/dynamicBody";
import SpinUpDb from "../(home)/_utils/spinUpDb";
import { Analytics } from "@vercel/analytics/next";
import "./drivers.css";

export const metadata = {
  title: "Trucksheets - Home",
  description: "Home page",
};

export default function TruckSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  SpinUpDb();
  return (
    <html lang="en">
      <DynamicBody>
        <NavBar />
        <div className="trucksheet-main-container">{children}</div>
        <Analytics />
      </DynamicBody>
    </html>
  );
}
