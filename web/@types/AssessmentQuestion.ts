
import type { Assessment } from './Assessment';
import type { Question } from './Question';

export interface AssessmentQuestion {
  id: string;
  assessmentId: string; // FK → Assessment.id
  questionId: string;   // FK → Question.id

  /** Display order within the assessment */
  sortOrder: number;

  /**
   * Per-assessment point override.
   * If null, falls back to Question.points.
   */
  pointsOverride: number | null;

  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  assessment?: Assessment;
  question?: Question;
}

export interface AssessmentQuestionCreateInput {
  assessmentId: string;
  questionId: string;
  sortOrder?: number;
  pointsOverride?: number | null;
}

export interface AssessmentQuestionUpdateInput {
  sortOrder?: number;
  pointsOverride?: number | null;
}