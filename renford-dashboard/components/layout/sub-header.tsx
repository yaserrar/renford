"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/etablissements", label: "Établissements" },
    { href: "/dashboard/utilisateurs", label: "Utilisateurs" },
  ];

  return (
    <div className="w-full bg-primary-dark py-4 flex justify-center">
      <div className="px-4 flex gap-8 items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-white hover:text-white/80 py-4 border-b-2 transition-colors border-transparent text-base",
              pathname.startsWith(link.href) && "font-semibold border-white",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
