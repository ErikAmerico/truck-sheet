import "../globals.css";
import NavBar from "./components/navBar/NavBar";
import DynamicBody from "./_utils/dynamicBody";

export const metadata = {
  title: "Trucksheets - Home",
  description: "Home page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <DynamicBody>
        <NavBar />
        {children}
      </DynamicBody>
    </html>
  );
}
