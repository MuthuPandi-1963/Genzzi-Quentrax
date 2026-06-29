// Auto-generated from Prisma model: Quiz

import { QuizStatus } from './enums';

import { Assessment } from './assessment.types';
import { CoinsHistory } from './CoinsHistory';
// import { Question } from './Question';
import { QuizHistory } from './QuizHistory';
import { Topic } from './Topic';
import { User } from './User';

export interface QuizListResponse {
  quizzes: Quiz[];
  count: number;
}
export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  totalPoints: number;
  status: QuizStatus;
  tags: string[];
  timeLimit: number | null;
  imageUrl: string | null;
  creatorId: string;
  topicId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
  topic?: Topic;
  questions: Question[];
  history: QuizHistory[];
  assessments: Assessment[];
  coinsHistory: CoinsHistory[];
}

export interface QuizCreateInput {
  title?: string;
  description?: string | null;
  totalPoints?: number;
  status?: QuizStatus;
  tags?: string[];
  timeLimit?: number | null;
  imageUrl?: string | null;
  creator?: User;
  topic?: Topic | null;
  questions?: Question[];
  history?: QuizHistory[];
  assessments?: Assessment[];
  coinsHistory?: CoinsHistory[];
}
export type AnswerValue = string | string[] | boolean | null;

export interface AnswerState {
  [questionId: string]: {
    value: AnswerValue;
    status: "unanswered" | "answered" | "flagged";
  };
}
export type QuestionType = "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "CODE";

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  options?: { id: string; text: string }[];
  hints?: string[];
}

export interface QuizSession {
  attemptId: string;
  questions: Question[];
  timeLimit: number;
  quizTitle: string;
  totalPoints: number;
}
