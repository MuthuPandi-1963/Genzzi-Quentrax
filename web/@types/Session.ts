// Auto-generated from Prisma model: Session

import { UserAuth } from './UserAuth';

export interface Session {
  id: string;
  userAuthId: string;
  tokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  userAuth: UserAuth;
}

export interface SessionCreateInput {
  tokenHash?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt?: Date;
  revokedAt?: Date | null;
  userAuth?: UserAuth;
}