// Auto-generated from Prisma model: Question

import { QuestionOptions } from '@/components/forms';
import { Difficulty, QuestionStatus, QuestionType } from './enums';
import { Topic } from './Topic';

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
  topic?: Topic;
  options:QuestionOptions;
  deletedAt?: string;
  updatedAt?: string | number | Date;
  createdAt: string;
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