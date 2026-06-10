
import type { AssessmentStatus } from './enums';
import type { AssessmentAssignment } from './AssessmentAssignment';
import type { AssessmentAttempt } from './AssessmentAttempt';
import type { AssessmentQuestion } from './AssessmentQuestion';
import type { Quiz } from './Quiz';
import type { Topic } from './Topic';
import type { UserProfile } from './UserProfile';

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  status: AssessmentStatus;
  deadline: Date | null;
  scheduledAt: Date | null;
  /** Duration in minutes — DB CHECK: timeLimit > 0 */
  timeLimit: number | null;

  // ── Availability window ────────────────────────────────────────────────────
  startDate: Date | null;
  endDate: Date | null;
  published: boolean;

  topicId: string | null; // FK → Topic.id
  creatorId: string;      // FK → UserProfile.id

  // ── Scoring config ─────────────────────────────────────────────────────────
  /** DB CHECK: passingScore BETWEEN 0 AND 100 */
  passingScore: number;
  /** DB CHECK: maxAttempts >= 1 */
  maxAttempts: number;
  /** DB CHECK: maxViolations >= 0 */
  maxViolations: number;

  // ── Security & behaviour ───────────────────────────────────────────────────
  proctoredMode: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  allowRetry: boolean;
  showResultImmediately: boolean;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  topic?: Topic | null;
  creator?: UserProfile;
  /**
   * Single source of truth for questions — do NOT use `quizzes` as source.
   * To import from a Quiz, copy rows into AssessmentQuestion.
   */
  assessmentQuestions?: AssessmentQuestion[];
  assignments?: AssessmentAssignment[];
  attempts?: AssessmentAttempt[];
  /** Legacy: kept for reporting only — not used as question source */
  quizzes?: Quiz[];
}

export interface AssessmentCreateInput {
  title: string;
  creatorId: string;
  description?: string | null;
  status?: AssessmentStatus;
  deadline?: Date | null;
  scheduledAt?: Date | null;
  timeLimit?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  published?: boolean;
  topicId?: string | null;
  passingScore?: number;
  maxAttempts?: number;
  maxViolations?: number;
  proctoredMode?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowReview?: boolean;
  allowRetry?: boolean;
  showResultImmediately?: boolean;
}

export interface AssessmentUpdateInput {
  title?: string;
  description?: string | null;
  status?: AssessmentStatus;
  deadline?: Date | null;
  scheduledAt?: Date | null;
  timeLimit?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  published?: boolean;
  topicId?: string | null;
  passingScore?: number;
  maxAttempts?: number;
  maxViolations?: number;
  proctoredMode?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowReview?: boolean;
  allowRetry?: boolean;
  showResultImmediately?: boolean;
  deletedAt?: Date | null;
}