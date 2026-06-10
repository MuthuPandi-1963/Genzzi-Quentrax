
import type { UserRole } from './enums';

// ── JWT / Access token payload ───────────────────────────────────────────────

/** Claims embedded in the signed access token (short-lived, ~15 min) */
export interface AccessTokenPayload {
  /** UserAuth.id */
  sub: string;
  /** UserProfile.id */
  profileId: string;
  email: string;
  role: UserRole;
  totpEnabled: boolean;
  iat: number;
  exp: number;
}

/** Claims embedded in the signed refresh token (long-lived, ~7 days) */
export interface RefreshTokenPayload {
  /** Session.id */
  sessionId: string;
  /** UserAuth.id */
  sub: string;
  iat: number;
  exp: number;
}

// ── Auth API request/response bodies ────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  /** Client TOTP code — required when MFA is enabled for the account */
  totpCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  /** Delivered as HttpOnly cookie in production — exposed here for mobile clients */
  refreshToken?: string;
  user: {
    id: string;
    profileId: string;
    email: string;
    name: string;
    role: UserRole;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  countryCode?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePaswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface EnableTotpResponse {
  /** QR code data URI for the authenticator app */
  qrCodeDataUrl: string;
  /** Raw secret for manual entry */
  secret: string;
}

export interface VerifyTotpRequest {
  code: string;
}
