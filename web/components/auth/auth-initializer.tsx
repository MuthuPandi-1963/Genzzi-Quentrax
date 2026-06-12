"use client";

import { AuthProvider } from "@/context/auth.context";
import { AuthGuard } from "./AuthGuard";

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
};
