// =============================================================================
// MODEL: UserAuth  (credentials, tokens, security state)
// =============================================================================

import type { Session } from './Session';
import type { UserProfile } from './UserProfile';

export interface UserAuth {
  id: string;
  userId: string; // FK → UserProfile.id

  // ── Credentials ────────────────────────────────────────────────────────────
  email: string;
  /** bcrypt/argon2 hash — NEVER expose on the client */
  password: string;

  // ── Email verification ─────────────────────────────────────────────────────
  /** SHA-256(rawToken); raw token is emailed to the user */
  verificationTokenHash: string | null;
  verificationTokenExpiresAt: Date | null;
  isVerified: boolean;

  // ── Password reset ─────────────────────────────────────────────────────────
  passwordResetTokenHash: string | null;
  passwordResetTokenExpiresAt: Date | null;

  // ── MFA / TOTP ─────────────────────────────────────────────────────────────
  /** Encrypted TOTP secret (AES-256-GCM at app layer) */
  totpSecret: string | null;
  totpEnabled: boolean;

  // ── Account state ──────────────────────────────────────────────────────────
  isBlocked: boolean;

  // ── Brute-force / rate-limiting ────────────────────────────────────────────
  failedLoginAttempts: number;
  lockedUntil: Date | null;

  // ── Soft delete ────────────────────────────────────────────────────────────
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  profile?: UserProfile;
  sessions?: Session[];
}

/** Used when registering a new user — only expose what the API actually accepts */
export interface UserAuthCreateInput {
  email: string;
  /** Raw password; hashed at the service layer before write */
  password: string;
}

export interface UserAuthUpdateInput {
  email?: string;
  password?: string;
  verificationTokenHash?: string | null;
  verificationTokenExpiresAt?: Date | null;
  isVerified?: boolean;
  passwordResetTokenHash?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  totpSecret?: string | null;
  totpEnabled?: boolean;
  isBlocked?: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  deletedAt?: Date | null;
}

/**
 * Safe public projection — strips all sensitive fields.
 * Use this as the API response type; never return the full UserAuth.
 */
export type UserAuthPublic = Pick<UserAuth, 'id' | 'email' | 'isVerified' | 'totpEnabled' | 'isBlocked'>;