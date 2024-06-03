import "./globals.css";
import { auth } from "auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body style={{ marginTop: session ? "64px" : "0" }}>{children}</body>
    </html>
  );
}
