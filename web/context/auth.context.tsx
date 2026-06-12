"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useMeQuery, useLoginMutation, useLogoutMutation } from "@/hooks/useAuth";
import { UserRole } from "@/@types/enums";
import { AuthContextValue, AuthStatus } from "@/@types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const status: AuthStatus = useMemo(() => {
    if (meQuery.isPending) return "loading";
    if (meQuery.isError) {
      if (meQuery.error?.response?.status === 401) return "unauthenticated";
      return "error";
    }
    if (meQuery.data?.success && meQuery.data.data) return "authenticated";
    return "unauthenticated";
  }, [meQuery.isPending, meQuery.isError, meQuery.error, meQuery.data]);

  const user = meQuery.data?.data ?? null;
  const role = user?.userProfile?.role ?? null;

  const isRole = useCallback(
    (checkRole: UserRole | UserRole[]): boolean => {
      if (!role) return false;
      if (Array.isArray(checkRole)) return checkRole.includes(role);
      return role === checkRole;
    },
    [role]
  );

  const login = useCallback(async () => {
    await loginMutation.mutateAsync();
  }, [loginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      isError: status === "error",
      error: meQuery.error instanceof Error ? meQuery.error : null,
      role,
      isRole,
      login,
      logout,
    }),
    [user, status, meQuery.error, role, isRole, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

