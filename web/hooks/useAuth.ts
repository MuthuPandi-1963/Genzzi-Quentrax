import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "../api/auth";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const register = useMutation({
    mutationFn: AuthAPI.register,
  });

  const logout = useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const logoutAll = useMutation({
    mutationFn: AuthAPI.logoutAll,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const refresh = useMutation({
    mutationFn: AuthAPI.refresh,
  });

  const verifyEmail = useMutation({
    mutationFn: AuthAPI.verifyEmail,
  });

  const resendVerification = useMutation({
    mutationFn: AuthAPI.resendVerification,
  });

  const forgotPassword = useMutation({
    mutationFn: AuthAPI.forgotPassword,
  });

  const resetPassword = useMutation({
    mutationFn: AuthAPI.resetPassword,
  });

  const mfaSetup = useMutation({
    mutationFn: AuthAPI.mfaSetup,
  });

  const mfaVerifySetup = useMutation({
    mutationFn: AuthAPI.mfaVerifySetup,
  });

  const mfaDisable = useMutation({
    mutationFn: AuthAPI.mfaDisable,
  });

  return {
    login,
    register,
    logout,
    logoutAll,
    refresh,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    mfaSetup,
    mfaVerifySetup,
    mfaDisable,
  };
};
