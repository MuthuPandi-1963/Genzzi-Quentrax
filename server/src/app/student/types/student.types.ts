// src/app/student/types/student.types.ts

import { Difficulty, AssignmentStatus } from "@prisma/client";

// ── Dashboard Response Types ───────────────────────────────────────────────

export interface StudentStats {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  role: string;
  coins: number;
  streak: number;
  totalQuizzesTaken: number;
  averageScore: number;
  totalAssessments: number;
  pendingAssessments: number;
}

export interface QuizHistoryItem {
  id: string;
  quizTitle: string;
  topicName: string;
  score: number;
  totalPoints: number;
  completedAt: Date;
  difficulty: Difficulty;
}

export interface AssignmentItem {
  id: string;
  title: string;
  topicName: string;
  status: AssignmentStatus;
  dueDate: Date | null;
  timeLimit: number | null;
  totalQuestions: number;
  passingScore: number;
  score?: number;
  startedAt?: Date | null;
}

export interface CoinsHistoryItem {
  id: string;
  coins: number;
  reason: string | null;
  createdAt: Date;
  quizTitle?: string | null;
}

export interface AvailableQuizItem {
  id: string;
  title: string;
  topicName: string | null;
  totalPoints: number;
  timeLimit: number | null;
  questionCount: number;
  difficulty: Difficulty;
  tags: string[];
}

export interface StudentDashboardResponse {
  stats: StudentStats;
  quizHistory: QuizHistoryItem[];
  assignments: AssignmentItem[];
  coinsHistory: CoinsHistoryItem[];
  availableQuizzes: AvailableQuizItem[];
}

// ── Progress Types ─────────────────────────────────────────────────────────

export interface ProgressStats {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number; // minutes
  quizzesByTopic: { topicName: string; count: number; averageScore: number }[];
  scoreTrend: { date: string; score: number }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  progress: number; // 0-100
}

// ── Leaderboard Types ──────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  totalScore: number;
  quizzesTaken: number;
  coins: number;
  streak: number;
}

// ── API Response Wrapper ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  code: string;
  meta?: Record<string, unknown> | null;
  timestamp: Date;
}
