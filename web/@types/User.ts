// =============================================================================
// MODEL: User  (backward-compat shim — maps to "_UserCompat" table)
//
// @deprecated Use UserProfile directly. This model exists only to avoid
// breaking existing application code during the UserAuth / UserProfile split
// migration. Remove once all references are updated.
// =============================================================================

import type { Assessment } from './Assessment';
import type { AssessmentAssignment } from './AssessmentAssignment';
import type { AssessmentAttempt } from './AssessmentAttempt';
import type { Coins } from './Coins';
import type { CoinsHistory } from './CoinsHistory';
import type { Quiz } from './Quiz';
import type { QuizHistory } from './QuizHistory';
import type { UserProfile } from './UserProfile';

/**
 * @deprecated Use `UserProfile` instead.
 * Compat wrapper kept for incremental migration only.
 */
export interface User {
  id: string;
  profileId: string;

  // ── Relations ─────────────────────────────────────────────────────────────
  profile?: UserProfile;
  quizHistory?: QuizHistory[];
  createdQuizzes?: Quiz[];
  coins?: Coins | null;
  coinsHistory?: CoinsHistory[];
  createdAssessments?: Assessment[];
  assessmentAssignments?: AssessmentAssignment[];
  assessmentAttempts?: AssessmentAttempt[];
}

/** @deprecated Use `UserProfileCreateInput` instead. */
export interface UserCreateInput {
  profileId: string;
}