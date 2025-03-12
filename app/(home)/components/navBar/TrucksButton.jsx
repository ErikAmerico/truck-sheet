"use client";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function TrucksButton({ id }) {
  const pathname = usePathname();

  return (
    <Link href="/trucks" className={pathname === "/trucks" ? "activeLink" : ""}>
      <Button id={id}>Trucks</Button>
    </Link>
  );
}
