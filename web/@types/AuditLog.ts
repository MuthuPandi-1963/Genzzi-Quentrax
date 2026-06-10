// =============================================================================
// MODEL: AuditLog
// =============================================================================

import type { AuditAction } from './enums';
import type { UserProfile } from './UserProfile';

export interface AuditLog {
  id: string;
  actorId: string; // FK → UserProfile.id

  action: AuditAction;

  /**
   * Polymorphic target model name (e.g. "Assessment", "UserProfile").
   * Pair with targetId to identify the affected record.
   */
  targetType: string | null;
  targetId: string | null;

  /** JSON snapshot of what changed — stored as raw DB Json column */
  metadata: Record<string, unknown> | null;

  createdAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  actor?: UserProfile;
}

export interface AuditLogCreateInput {
  actorId: string;
  action: AuditAction;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}