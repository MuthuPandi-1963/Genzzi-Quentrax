// Auto-generated from Prisma model: Topic

import { Difficulty } from './enums';

import { Assessment } from './Assessment';
import { Category } from './Category';
import { Question } from './Question';
import { Quiz } from './Quiz';

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  imageUrl: string | null;
  difficulty: Difficulty;
  tags: string[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  questions: Question[];
  assessments: Assessment[];
  quizzes: Quiz[];
}

export interface TopicCreateInput {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  difficulty?: Difficulty;
  tags?: string[];
  category?: Category;
  questions?: Question[];
  assessments?: Assessment[];
  quizzes?: Quiz[];
}