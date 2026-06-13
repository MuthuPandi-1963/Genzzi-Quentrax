// Auto-generated from Prisma model: AssessmentQuestion

import { Assessment } from './assessment.types';
import { Question } from './Question';

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionId: string;
  sortOrder: number;
  pointsOverride: number | null;
  createdAt: Date;
  updatedAt: Date;
  assessment: Assessment;
  question: Question;
}

export interface AssessmentQuestionCreateInput {
  sortOrder?: number;
  pointsOverride?: number | null;
  assessment?: Assessment;
  question?: Question;
}