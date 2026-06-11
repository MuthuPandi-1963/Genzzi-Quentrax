import { QuizStatus, Difficulty } from "@prisma/client";

export interface CreatorRelation {
  id: string;
  name: string | null;
  avatar: string | null;
  role: string | null;
}

export interface TopicRelation {
  id: string;
  name: string | null;
  description: string | null;
  categoryId: string;
  difficulty: Difficulty;
}

export interface QuestionRelation {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: Difficulty;
  points: number;
  status: string;
}

export interface QuizResponse {
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
  createdAt: Date;
  updatedAt: Date;
  creator?: CreatorRelation | undefined;
  topic?: TopicRelation | null; // was TopicRelation | undefined
  questions?: QuestionRelation[];
}

export interface QuizListResponse {
  quizzes: QuizResponse[];
  count: number;
}
