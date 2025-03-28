import "../globals.css";
import NavBar from "./components/navBar/NavBar";
import DynamicBody from "./_utils/dynamicBody";
import SpinUpDb from "./_utils/spinUpDb";

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
      </DynamicBody>
    </html>
  );
}
