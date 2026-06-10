// =============================================================================
// MODEL: QuizHistory
// =============================================================================

import type { Quiz } from './Quiz';
import type { UserProfile } from './UserProfile';

export interface QuizHistory {
  id: string;
  userId: string;  // FK → UserProfile.id
  quizId: string;  // FK → Quiz.id
  score: number;
  completedAt: Date;
  /**
   * Encrypted at application layer (AES-256-GCM) before write.
   * Deserialise carefully — do not expose raw to the client.
   */
  answers: Record<string, unknown>;

  // ── Relations ─────────────────────────────────────────────────────────────
  user?: UserProfile;
  quiz?: Quiz;
}

export interface QuizHistoryCreateInput {
  userId: string;
  quizId: string;
  score: number;
  answers: Record<string, unknown>;
  completedAt?: Date;
}