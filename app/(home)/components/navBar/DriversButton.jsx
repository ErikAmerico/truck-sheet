"use client";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function DriversButton({ id }) {
  const pathname = usePathname();

  return (
    <Link
      href="/drivers"
      className={pathname === "/drivers" ? "activeLink" : ""}
    >
      <Button id={id}>Drivers</Button>
    </Link>
  );
}
