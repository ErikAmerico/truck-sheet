"use client";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function OfficeEmployeesButton({ id }) {
  const pathname = usePathname();

  return (
    <Link href="/office" className={pathname === "/office" ? "activeLink" : ""}>
      <Button id={id}>Office</Button>
    </Link>
  );
}
