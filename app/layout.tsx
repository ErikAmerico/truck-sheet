import "./globals.css";
import { auth } from "auth";
import NavBar from "./navBar/NavBar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body style={{ marginTop: session ? "64px" : "0" }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
