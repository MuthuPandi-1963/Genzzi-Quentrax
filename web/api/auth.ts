import AxiosInstance from "./axiosInstance.js";

const url = "auth";

export const AuthAPI = {
  // Register new user
  register: (data: any) => AxiosInstance.post(`/${url}/register`, data),

  // Login
  login: (data: any) => AxiosInstance.post(`/${url}/login`, data),

  // Logout current session
  logout: () => AxiosInstance.post(`/${url}/logout`),

  // Logout all sessions
  logoutAll: () => AxiosInstance.post(`/${url}/logout-all`),

  // Refresh access token
  refresh: () => AxiosInstance.post(`/${url}/refresh`),

  // Verify email
  verifyEmail: (data: any) => AxiosInstance.post(`/${url}/verify-email`, data),

  // Resend verification email
  resendVerification: (data: any) => AxiosInstance.post(`/${url}/resend-verification`, data),

  // Forgot password
  forgotPassword: (data: any) => AxiosInstance.post(`/${url}/forgot-password`, data),

  // Reset password
  resetPassword: (data: any) => AxiosInstance.post(`/${url}/reset-password`, data),

  // Setup MFA/TOTP
  mfaSetup: () => AxiosInstance.post(`/${url}/mfa/setup`),

  // Verify MFA setup
  mfaVerifySetup: (data: any) => AxiosInstance.post(`/${url}/mfa/verify-setup`, data),

  // Disable MFA
  mfaDisable: (data: any) => AxiosInstance.post(`/${url}/mfa/disable`, data),
};
