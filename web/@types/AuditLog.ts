// Auto-generated from Prisma model: AuditLog

import { AuditAction } from './enums';

import { UserProfile } from './UserProfile';

export interface AuditLog {
  id: string;
  actorId: string;
  action: AuditAction;
  targetType: string | null;
  targetId: string | null;
  metadata: any | null;
  createdAt: Date;
  actor: UserProfile;
}

export interface AuditLogCreateInput {
  action?: AuditAction;
  targetType?: string | null;
  metadata?: any | null;
  actor?: UserProfile;
}