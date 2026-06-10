// =============================================================================
// MODEL: Session
// =============================================================================

import type { UserAuth } from './UserAuth';

export interface Session {
  id: string;
  userAuthId: string;
  /** SHA-256(refreshToken) stored server-side; raw token sent to client */
  tokenHash: string;
  userAgent: string | null;
  /** IPv4 or IPv6 address (max 45 chars) */
  ipAddress: string | null;
  expiresAt: Date;
  /** Non-null means the session has been revoked (soft-revoke for audit trail) */
  revokedAt: Date | null;
  createdAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  userAuth?: UserAuth;
}

export interface SessionCreateInput {
  userAuthId: string;
  tokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
  revokedAt?: Date | null;
}

export interface SessionUpdateInput {
  revokedAt?: Date | null;
  expiresAt?: Date;
}