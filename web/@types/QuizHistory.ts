// Auto-generated from Prisma model: QuizHistory

import { Quiz } from './Quiz';
import { UserProfile } from './UserProfile';

export interface QuizHistory {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: Date;
  answers: any;
  user: UserProfile;
  quiz: Quiz;
}

export interface QuizHistoryCreateInput {
  score?: number;
  completedAt?: Date;
  answers?: any;
  user?: UserProfile;
  quiz?: Quiz;
}