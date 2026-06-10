// Auto-generated from Prisma model: Quiz

import { QuizStatus } from './enums';

import { Assessment } from './Assessment';
import { CoinsHistory } from './CoinsHistory';
import { Question } from './Question';
import { QuizHistory } from './QuizHistory';
import { Topic } from './Topic';
import { User } from './User';

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
  topic: Topic | null;
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