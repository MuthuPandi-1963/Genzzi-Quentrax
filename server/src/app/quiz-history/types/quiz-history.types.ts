export interface QuizRelation {
  id: string;
  title: string;
  description: string | null;
  totalPoints: number;
}

export interface UserRelation {
  id: string;
  name: string;
  role: string;
}

export interface QuizHistoryResponse {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: any;
  completedAt: Date;
  quiz?: QuizRelation;
  user?: UserRelation;
}

export interface QuizHistoryListResponse {
  quizHistories: QuizHistoryResponse[];
  count: number;
}
