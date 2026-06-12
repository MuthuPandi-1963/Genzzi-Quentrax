import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AuthAPI  } from "@/api/auth";
import { ApiResponse, AuthUser } from "@/@types/auth";

const ME_QUERY_KEY = ["auth", "me"] as const;

// ── useMeQuery: fetches on mount, handles loading/error automatically ───────

export const useMeQuery = () =>
  useQuery<ApiResponse<AuthUser>, AxiosError>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const response = await AuthAPI.me(); // AxiosResponse<ApiResponse<AuthUser>>
      return response.data; // ← ApiResponse<AuthUser> ✓
    },
    retry: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// ── useLoginMutation ─────────────────────────────────────────────────────────

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
};

// ── useLogoutMutation ────────────────────────────────────────────────────────

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
      queryClient.clear();
    },
  });
};
