// Auto-generated from Prisma model: UserAuth

import { Session } from './Session';
import { UserProfile } from './UserProfile';

export interface UserAuth {
  id: string;
  userId: string;
  email: string;
  password: string;
  verificationTokenHash: string | null;
  verificationTokenExpiresAt: Date | null;
  isVerified: boolean;
  passwordResetTokenHash: string | null;
  passwordResetTokenExpiresAt: Date | null;
  totpSecret: string | null;
  totpEnabled: boolean;
  isBlocked: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfile;
  sessions: Session[];
}

export interface UserAuthCreateInput {
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
  profile?: UserProfile;
  sessions?: Session[];
}