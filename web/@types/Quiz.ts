
import type { QuizStatus } from './enums';
import type { Assessment } from './Assessment';
import type { CoinsHistory } from './CoinsHistory';
import type { Question } from './Question';
import type { QuizHistory } from './QuizHistory';
import type { Topic } from './Topic';
import type { UserProfile } from './UserProfile';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;

  /**
   * Cached computed value: SUM(question.points).
   * Do NOT write directly — update via Prisma middleware on question add/remove.
   */
  totalPoints: number;

  status: QuizStatus;
  tags: string[];
  /** Duration in minutes — DB CHECK: timeLimit > 0 */
  timeLimit: number | null;
  imageUrl: string | null;
  creatorId: string; // FK → UserProfile.id
  topicId: string | null; // FK → Topic.id
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  /** Canonical creator — UserProfile (not the deprecated User shim) */
  creator?: UserProfile;
  topic?: Topic | null;
  questions?: Question[];
  history?: QuizHistory[];
  assessments?: Assessment[];
  coinsHistory?: CoinsHistory[];
}

export interface QuizCreateInput {
  title: string;
  creatorId: string;
  description?: string | null;
  status?: QuizStatus;
  tags?: string[];
  /** Minutes — must be > 0 if provided */
  timeLimit?: number | null;
  imageUrl?: string | null;
  topicId?: string | null;
}

export interface QuizUpdateInput {
  title?: string;
  description?: string | null;
  status?: QuizStatus;
  tags?: string[];
  timeLimit?: number | null;
  imageUrl?: string | null;
  topicId?: string | null;
  deletedAt?: Date | null;
}