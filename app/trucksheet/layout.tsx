import "../globals.css";
import NavBar from "../navBar/NavBar";

export default async function TruckSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
