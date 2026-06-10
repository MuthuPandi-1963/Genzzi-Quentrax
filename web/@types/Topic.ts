// =============================================================================
// MODEL: Topic
// =============================================================================

import type { Difficulty } from './enums';
import type { Assessment } from './Assessment';
import type { Category } from './Category';
import type { Question } from './Question';
import type { Quiz } from './Quiz';

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  categoryId: string; // FK → Category.id
  imageUrl: string | null;
  difficulty: Difficulty;
  tags: string[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  category?: Category;
  questions?: Question[];
  assessments?: Assessment[];
  quizzes?: Quiz[];
}

export interface TopicCreateInput {
  name: string;
  categoryId: string;
  description?: string | null;
  imageUrl?: string | null;
  difficulty?: Difficulty;
  tags?: string[];
}

export interface TopicUpdateInput {
  name?: string;
  categoryId?: string;
  description?: string | null;
  imageUrl?: string | null;
  difficulty?: Difficulty;
  tags?: string[];
  deletedAt?: Date | null;
}