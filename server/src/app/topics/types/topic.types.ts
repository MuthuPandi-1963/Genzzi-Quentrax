import { Difficulty } from "@prisma/client";

export interface CategoryRelation {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export interface QuestionRelation {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: Difficulty;
  points: number;
  status: string;
}

export interface TopicResponse {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  imageUrl: string | null;
  difficulty: Difficulty;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category?: CategoryRelation;
  questions?: QuestionRelation[];
}

export interface TopicListResponse {
  topics: TopicResponse[];
  count: number;
}
