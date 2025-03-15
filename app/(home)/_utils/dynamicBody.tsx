"use client";

import { usePathname } from "next/navigation";

export default function DynamicBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bodyClass =
    pathname === "/" || pathname === "/trucksheet" ? "scrollable" : "no-scroll";

  return <body className={bodyClass}>{children}</body>;
}
