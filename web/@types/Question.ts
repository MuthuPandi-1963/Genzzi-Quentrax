// =============================================================================
// MODEL: Question
// =============================================================================

import type { Difficulty, QuestionStatus, QuestionType } from './enums';
import type { QuestionOptions } from './QuestionOptions';
import type { AssessmentQuestion } from './AssessmentQuestion';
import type { Quiz } from './Quiz';
import type { Topic } from './Topic';

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  hints: string[];
  points: number;
  explanation: string | null;
  tags: string[];
  status: QuestionStatus;

  /**
   * Typed JSON options — shape depends on questionType:
   *  - MCQ / TRUE_FALSE → McqOptions
   *  - FILL_BLANK        → FillBlankOptions
   */
  options: QuestionOptions;

  topicId: string; // FK → Topic.id
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  topic?: Topic;
  quizzes?: Quiz[];
  assessmentQuestions?: AssessmentQuestion[];
}

export interface QuestionCreateInput {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  topicId: string;
  options: QuestionOptions;
  hints?: string[];
  points?: number;
  explanation?: string | null;
  tags?: string[];
  status?: QuestionStatus;
}

export interface QuestionUpdateInput {
  questionText?: string;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  topicId?: string;
  options?: QuestionOptions;
  hints?: string[];
  points?: number;
  explanation?: string | null;
  tags?: string[];
  status?: QuestionStatus;
  deletedAt?: Date | null;
}