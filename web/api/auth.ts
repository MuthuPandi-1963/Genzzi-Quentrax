import axiosInstance from "@/lib/axiosInstance";

const url = "auth";

export const AuthAPI = {
  // Register new user
  register: (data: any) => axiosInstance.post(`/${url}/register`, data),

  // Login
  login: (data: any) => axiosInstance.post(`/${url}/login`, data),

  // Logout current session
  logout: () => axiosInstance.post(`/${url}/logout`),

  // Logout all sessions
  logoutAll: () => axiosInstance.post(`/${url}/logout-all`),

  // Refresh access token
  refresh: () => axiosInstance.post(`/${url}/refresh`),

  // Verify email
  verifyEmail: (data: any) => axiosInstance.post(`/${url}/verify-email`, data),

  // Resend verification email
  resendVerification: (data: any) => axiosInstance.post(`/${url}/resend-verification`, data),

  // Forgot password
  forgotPassword: (data: any) => axiosInstance.post(`/${url}/forgot-password`, data),

  // Reset password
  resetPassword: (data: any) => axiosInstance.post(`/${url}/reset-password`, data),

  // Setup MFA/TOTP
  mfaSetup: () => axiosInstance.post(`/${url}/mfa/setup`),

  // Verify MFA setup
  mfaVerifySetup: (data: any) => axiosInstance.post(`/${url}/mfa/verify-setup`, data),

  // Disable MFA
  mfaDisable: (data: any) => axiosInstance.post(`/${url}/mfa/disable`, data),
};
