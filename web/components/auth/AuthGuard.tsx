"use client";

import { useAuthContext } from "@/context/auth.context";
import { isPublicPath } from "@/lib/route";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = isPublicPath(pathname);

    if (!isAuthenticated && !isPublic) {
      router.replace("/login");
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Authenticating...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};