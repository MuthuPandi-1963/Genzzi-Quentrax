// =============================================================================
// MODEL: UserProfile  (identity, display data, roles, activity)
// =============================================================================

import type { UserRole } from './enums';
import type { Assessment } from './Assessment';
import type { AssessmentAssignment } from './AssessmentAssignment';
import type { AssessmentAttempt } from './AssessmentAttempt';
import type { AuditLog } from './AuditLog';
import type { Coins } from './Coins';
import type { CoinsHistory } from './CoinsHistory';
import type { Quiz } from './Quiz';
import type { QuizHistory } from './QuizHistory';
import type { UserAuth } from './UserAuth';

export interface UserProfile {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2 (e.g. "IN", "US") — DB CHECK: char_length = 2 */
  countryCode: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  auth?: UserAuth | null;
  quizHistory?: QuizHistory[];
  createdQuizzes?: Quiz[];
  coins?: Coins | null;
  coinsHistory?: CoinsHistory[];
  createdAssessments?: Assessment[];
  assessmentAssignments?: AssessmentAssignment[];
  assessmentAttempts?: AssessmentAttempt[];
  auditLogsActed?: AuditLog[];
}

export interface UserProfileCreateInput {
  name: string;
  countryCode?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role?: UserRole;
}

export interface UserProfileUpdateInput {
  name?: string;
  countryCode?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role?: UserRole;
  deletedAt?: Date | null;
}

/**
 * Safe public projection — safe to expose in list endpoints.
 * Excludes deletedAt and all nested relations.
 */
export type UserProfilePublic = Pick<
  UserProfile,
  'id' | 'name' | 'countryCode' | 'avatar' | 'bio' | 'role' | 'createdAt'
>;