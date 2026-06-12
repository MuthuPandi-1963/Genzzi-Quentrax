// types/student.ts
// ── Shared types for student dashboard data ──────────────────────────────────

import { Difficulty } from "./enums";


export type AssignmentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "EXEMPTED";

export interface QuizHistoryItem {
  id: string;
  quizTitle: string;
  topicName: string;
  score: number;
  totalPoints: number;
  completedAt: string;
  difficulty: Difficulty;
}

export interface AssignmentItem {
  id: string;
  title: string;
  topicName: string;
  status: AssignmentStatus;
  dueDate: string;
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
  score?: number;
}

export interface CoinsHistoryItem {
  id: string;
  coins: number;
  reason: string;
  createdAt: string;
}

export interface AvailableQuizItem {
  id: string;
  title: string;
  topicName: string;
  totalPoints: number;
  timeLimit: number;
  questionCount: number;
  difficulty: Difficulty;
  tags: string[];
}

export interface StudentStats {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  coins: number;
  streak: number;
  role: string;
}

export interface StudentDashboardData {
  stats: StudentStats;
  quizHistory: QuizHistoryItem[];
  assignments: AssignmentItem[];
  coinsHistory: CoinsHistoryItem[];
  availableQuizzes: AvailableQuizItem[];
}