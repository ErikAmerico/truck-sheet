"use client";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function HomeButton({ id }) {
  const pathname = usePathname();

  return (
    <Link href="/" className={pathname === "/" ? "activeLink" : ""}>
      <Button id={id}>Home</Button>
    </Link>
  );
}
