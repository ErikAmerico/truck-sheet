"use client";
import { useRouter, usePathname } from "next/navigation";
import Button from "@mui/material/Button";

export default function DriversButton({ id }) {
  const router = useRouter();
  const pathname = usePathname();

  const isDriversPage = pathname === "/drivers";

  return (
    <Button
      id={id}
      onClick={() => {
        router.push(isDriversPage ? "/" : "/drivers");
      }}
    >
      {isDriversPage ? "Home" : "Drivers"}
    </Button>
  );
}
