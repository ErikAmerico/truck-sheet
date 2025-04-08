import "../globals.css";
import NavBar from "./components/navBar/NavBar";
import DynamicBody from "./_utils/dynamicBody";
import SpinUpDb from "./_utils/spinUpDb";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Trucksheets - Home",
  description: "Home page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  SpinUpDb();
  return (
    <html lang="en">
      <DynamicBody>
        <NavBar />
        {children}
        <Analytics />
      </DynamicBody>
    </html>
  );
}
