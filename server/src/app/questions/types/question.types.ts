import { Difficulty, QuestionType, QuestionStatus } from "@prisma/client";

export interface CategoryRelation {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export interface TopicRelation {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  difficulty: Difficulty;
  category?: CategoryRelation;
}

export interface QuestionResponse {
  id: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  hints: string[];
  points: number;
  explanation: string | null;
  tags: string[];
  status: QuestionStatus;
  options: any;
  topicId: string;
  createdAt: Date;
  updatedAt: Date;
  topic?: TopicRelation;
}

export interface QuestionListResponse {
  questions: QuestionResponse[];
  count: number;
}
