import "../globals.css";
import NavBar from "./components/navBar/NavBar";

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
      <body style={{ marginTop: "64px" }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
