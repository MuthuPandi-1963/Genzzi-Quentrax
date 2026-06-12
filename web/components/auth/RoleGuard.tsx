// ── components/RoleGuard.tsx  (FIXED) ───────────────────────────────────────

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";
import { isPublicPath, canAccess, getDefaultRoute } from "@/lib/route";

interface RoleGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ children, fallback }: RoleGuardProps) => {
  const { status, isLoading, role, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    if (isLoading) return;

    // 🔥 FIX 1: Public pages — NEVER redirect, even if authenticated
    // Users should be able to visit /, /about, /faq while logged in
    if (isPublic) {
      return; // ← Just render the page, no redirect
    }

    // Protected page + unauthenticated → login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 🔥 FIX 2: Role check only for protected routes
    if (!canAccess(pathname, role)) {
      router.replace(getDefaultRoute(role));
      return;
    }
  }, [isLoading, isAuthenticated, role, pathname, router, isPublic]);

  // Show loading only on protected pages during auth check
  if (isLoading && !isPublic) {
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

  // 🔥 FIX 3: Remove the forbidden flash for public pages
  // Only show forbidden on protected routes
  if (isAuthenticated && !canAccess(pathname, role) && !isPublic) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-slate-400">You don't have access to this page</p>
          <button
            onClick={() => router.push(getDefaultRoute(role))}
            className="mt-4 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 🔥 FIX 4: Always render children for public pages
  return <>{children}</>;
};