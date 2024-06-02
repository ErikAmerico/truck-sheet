"use client";
import { useRouter, usePathname } from "next/navigation";
import Button from "@mui/material/Button";

export default function TrucksButton({ id }) {
  const router = useRouter();
  const pathname = usePathname();

  const isTrucksPage = pathname === "/trucks";

  return (
    <Button
      id={id}
      onClick={() => {
        router.push(isTrucksPage ? "/" : "/trucks");
      }}
    >
      {isTrucksPage ? "Home" : "Trucks"}
    </Button>
  );
}
