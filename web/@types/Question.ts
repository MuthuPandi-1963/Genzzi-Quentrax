// Auto-generated from Prisma model: Question

import { Difficulty, QuestionStatus, QuestionType } from './enums';

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
}

export interface QuestionCreateInput {
  questionText?: string;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  hints?: string[];
  points?: number;
  explanation?: string | null;
  tags?: string[];
  status?: QuestionStatus;
}