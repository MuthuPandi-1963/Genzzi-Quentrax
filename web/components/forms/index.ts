// ─────────────────────────────────────────────────────────────────────────────
// @types/index.ts  —  Shared quiz-app types (mirrors Prisma schema exactly)
// ─────────────────────────────────────────────────────────────────────────────

import { Difficulty, QuestionStatus, QuestionType, QuizStatus } from "@/@types/enums";

// ── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "STAFF" | "STUDENT";

export type AssessmentStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED";

export type AttemptStatus = "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

export type AssignmentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "EXEMPTED";

export type AuditAction =
  | "USER_BLOCKED"
  | "USER_UNBLOCKED"
  | "USER_ROLE_CHANGED"
  | "USER_DELETED"
  | "ASSESSMENT_CREATED"
  | "ASSESSMENT_UPDATED"
  | "ASSESSMENT_ASSIGNED"
  | "ASSESSMENT_DELETED"
  | "QUESTION_CREATED"
  | "QUESTION_DELETED"
  | "QUIZ_CREATED"
  | "QUIZ_DELETED"
  | "COINS_ADJUSTED";

// ── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

// ── Topic ─────────────────────────────────────────────────────────────────────

export interface Topic {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  imageUrl?: string;
  difficulty: Difficulty;
  tags: string[];
  deletedAt?: string | null;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface TopicFormData {
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  difficulty: Difficulty;
  tags: string[];
}

// ── Question options ──────────────────────────────────────────────────────────

export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface FillBlankOptions {
  acceptedAnswers: string[];
  caseSensitive: boolean;
}

export interface BooleanType {
  answer : boolean
}

export interface LongAnswer {
  text: string;
}

export interface Coding {
  text: string;
}

export type QuestionOptions = MCQOption[] | FillBlankOptions | BooleanType | LongAnswer | Coding;

// ── Question ─────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  hints: string[];
  points: number;
  explanation?: string;
  tags: string[];
  status: QuestionStatus;
  options: QuestionOptions;
  topicId: string;
  topic?: Topic;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFormData {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  hints: string[];
  points: number;
  explanation: string;
  tags: string[];
  status: QuestionStatus;
  options: QuestionOptions;
  topicId: string;
}

// ── Quiz ─────────────────────────────────────────────────────────────────────

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  totalPoints: number;
  status: QuizStatus;
  tags: string[];
  timeLimit?: number;
  imageUrl?: string;
  creatorId: string;
  topicId?: string;
  topic?: Topic;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizFormData {
  title: string;
  description: string;
  status: QuizStatus;
  tags: string[];
  timeLimit: number | "";
  imageUrl: string;
  topicId: string;
}

// ── Assessment ────────────────────────────────────────────────────────────────

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  status: AssessmentStatus;
  deadline?: string | null;
  scheduledAt?: string | null;
  timeLimit?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  published: boolean;
  topicId?: string | null;
  passingScore: number;
  maxAttempts: number;
  maxViolations: number;
  proctoredMode: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  allowRetry: boolean;
  showResultImmediately: boolean;
  deletedAt?: string | null;
  creatorId: string;
  topic?: Topic;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentFormData {
  title: string;
  description: string;
  status: AssessmentStatus;
  deadline: string;
  scheduledAt: string;
  timeLimit: number | "";
  startDate: string;
  endDate: string;
  published: boolean;
  topicId: string;
  passingScore: number;
  maxAttempts: number;
  maxViolations: number;
  proctoredMode: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  allowRetry: boolean;
  showResultImmediately: boolean;
}

// ── Coins ─────────────────────────────────────────────────────────────────────

export interface Coins {
  id: string;
  userId: string;
  balance: number;
  updatedAt: string;
  createdAt: string;
}

export interface CoinsHistory {
  id: string;
  userId: string;
  coinsId: string;
  coins: number;
  reason?: string;
  quizId?: string;
  createdAt: string;
}

// ── Quiz History ──────────────────────────────────────────────────────────────

export interface QuizHistory {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: string;
  answers: unknown;
  quiz?: Quiz;
}

// ── Assessment Attempt ────────────────────────────────────────────────────────

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  answers: unknown;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string | null;
  violations: number;
}

// ── Assessment Assignment ─────────────────────────────────────────────────────

export interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  userId: string;
  status: AssignmentStatus;
  assignedAt: string;
  dueDate?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  assessment?: Assessment;
}

// ── Audit Log ─────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  actorId: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  metadata?: unknown;
  createdAt: string;
}