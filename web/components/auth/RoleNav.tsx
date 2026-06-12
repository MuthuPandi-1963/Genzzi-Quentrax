"use client";

import { useAuthContext } from "@/context/auth.context";
import { ROLE_ROUTES } from "@/lib/route";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const RoleNav = () => {
  const { role, isAuthenticated } = useAuthContext();
  const pathname = usePathname();

  if (!isAuthenticated || !role) return null;

  const links = ROLE_ROUTES[role] || [];

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname === link.path || pathname.startsWith(`${link.path}/`);
        return (
          <Link
            key={link.path}
            href={link.path}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};