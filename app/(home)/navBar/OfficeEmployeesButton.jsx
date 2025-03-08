"use client";
import { useRouter, usePathname } from "next/navigation";
import Button from "@mui/material/Button";

export default function OfficeEmployeesButton({ id }) {
  const router = useRouter();
  const pathname = usePathname();

  const isOfficeEmployeesPage = pathname === "/office";

  return (
    <Button
      id={id}
      onClick={() => {
        router.push(isOfficeEmployeesPage ? "/" : "/office");
      }}
    >
      {isOfficeEmployeesPage ? "Home" : "Office"}
    </Button>
  );
}
