
import type { AttemptStatus } from './enums';
import type { Assessment } from './Assessment';
import type { UserProfile } from './UserProfile';

export interface AssessmentAttempt {
  id: string;
  assessmentId: string; // FK → Assessment.id
  userId: string;       // FK → UserProfile.id

  /** DB CHECK: score >= 0 */
  score: number;

  /**
   * Encrypted at application layer (AES-256-GCM) before write.
   * Deserialise carefully — never expose raw payload to the client.
   */
  answers: Record<string, unknown>;

  /**
   * Defaults to IN_PROGRESS — only transitions to COMPLETED on confirmed submit,
   * or EXPIRED when the time window closes.
   */
  status: AttemptStatus;

  startedAt: Date;
  completedAt: Date | null;

  /** Proctoring violation count — triggers auto-submit at Assessment.maxViolations */
  violations: number;

  // ── Relations ─────────────────────────────────────────────────────────────
  assessment?: Assessment;
  user?: UserProfile;
}

export interface AssessmentAttemptCreateInput {
  assessmentId: string;
  userId: string;
  answers?: Record<string, unknown>;
  status?: AttemptStatus;
  startedAt?: Date;
}

export interface AssessmentAttemptUpdateInput {
  score?: number;
  answers?: Record<string, unknown>;
  status?: AttemptStatus;
  completedAt?: Date | null;
  violations?: number;
}