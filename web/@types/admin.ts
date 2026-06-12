// types/admin.ts — Quentrax Admin Panel Shared TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════════════════

import { Difficulty } from "./enums";

/* ──────────────────────────────────────────────────────────────────────────
   CORE USER TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type UserRole = "ADMIN" | "STAFF" | "STUDENT";
export type UserStatus = "active" | "inactive" | "banned";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  lastActive: string;
  createdAt: string;
  coins: number;
  quizzesTaken: number;
  avgScore: number;
}

export interface UserListResponse {
  data: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

/* ──────────────────────────────────────────────────────────────────────────
   QUIZ / CONTENT TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type QuizStatus = "draft" | "published" | "archived";

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  questionCount: number;
  timeLimit: number; // minutes
  attempts: number;
  avgScore: number;
  status: QuizStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  tags?: string[];
}

export interface QuizListResponse {
  data: Quiz[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Question {
  id: string;
  quizId: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: Difficulty;
  category: string;
  createdAt: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   ASSESSMENT TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type AssessmentType = "quiz" | "exam" | "assignment";
export type AssessmentStatus = "upcoming" | "active" | "completed" | "graded";

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  description?: string;
  dueDate: string;
  startDate?: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  avgScore: number;
  status: AssessmentStatus;
  maxScore: number;
  passingScore?: number;
  createdBy: string;
  createdAt: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   COIN / TRANSACTION TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type TransactionType = "earned" | "spent" | "bonus" | "penalty" | "refund";

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: TransactionType;
  amount: number;
  reason: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  processedBy?: string;
}

export interface CoinEconomySummary {
  totalDistributed: number;
  totalInCirculation: number;
  totalEarnedToday: number;
  totalSpentToday: number;
  netFlowToday: number;
  topEarners: { userId: string; userName: string; amount: number }[];
}

/* ──────────────────────────────────────────────────────────────────────────
   LEADERBOARD TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  coins: number;
  streak: number;
  quizzesCompleted: number;
  avgAccuracy: number;
  trend: "up" | "down" | "same";
  previousRank?: number;
}

/* ──────────────────────────────────────────────────────────────────────────
   DASHBOARD / ANALYTICS TYPES
   ────────────────────────────────────────────────────────────────────────── */

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  newUsersToday: number;
  activeQuizzes: number;
  totalQuizzes: number;
  quizzesTakenToday: number;
  assessments: number;
  activeAssessments: number;
  submissionsToday: number;
  coinsDistributed: number;
  coinsEarnedToday: number;
  coinsSpentToday: number;
  // Growth percentages
  userGrowth: number;        // vs last period
  quizGrowth: number;
  assessmentGrowth: number;
  coinGrowth: number;
  engagementGrowth: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  users: number;
  quizzes: number;
  assessments: number;
  coins: number;
  engagement: number;
}

export interface AnalyticsOverview {
  stats: DashboardStats;
  timeSeries: TimeSeriesDataPoint[];
  topCategories: { name: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  hourlyActivity: { hour: number; users: number }[];
}

/* ──────────────────────────────────────────────────────────────────────────
   ACTIVITY LOG TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type ActivityType = "quiz" | "user" | "system" | "security" | "content" | "coin";

export interface ActivityLog {
  id: string;
  user: string;
  userId?: string;
  userAvatar?: string;
  action: string;
  target: string;
  targetId?: string;
  targetType?: string;
  timestamp: string;
  score?: number;
  type: ActivityType;
  metadata?: Record<string, unknown>;
}

/* ──────────────────────────────────────────────────────────────────────────
   NOTIFICATION TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type NotificationType = "user" | "quiz" | "alert" | "security" | "system" | "achievement";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   APPROVAL / MODERATION TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type ApprovalType = "user" | "quiz" | "question" | "content" | "report";
export type ApprovalPriority = "low" | "medium" | "high" | "critical";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated";

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  subtitle: string;
  description?: string;
  requestedBy: string;
  requestedById?: string;
  requesterAvatar?: string;
  timeAgo: string;
  createdAt: string;
  priority: ApprovalPriority;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewNote?: string;
  reviewDate?: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   SYSTEM HEALTH TYPES
   ────────────────────────────────────────────────────────────────────────── */

export type HealthStatus = "healthy" | "warning" | "critical" | "unknown";

export interface HealthMetric {
  name: string;
  value: number;        // 0-100
  status: HealthStatus;
  detail: string;
  unit?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
  lastChecked: string;
}

export interface SystemHealth {
  overall: number;      // 0-100 aggregate
  status: HealthStatus;
  uptime: number;       // percentage
  metrics: HealthMetric[];
  incidents: {
    id: string;
    title: string;
    severity: HealthStatus;
    startedAt: string;
    resolvedAt?: string;
    description?: string;
  }[];
  lastUpdated: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   AUDIT / SECURITY TYPES
   ────────────────────────────────────────────────────────────────────────── */

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: Record<string, unknown>;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  userName: string;
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  trusted: boolean;
  current: boolean;
}

/* ──────────────────────────────────────────────────────────────────────────
   COMMUNICATION TYPES
   ────────────────────────────────────────────────────────────────────────── */

export interface BroadcastMessage {
  id: string;
  title: string;
  body: string;
  type: "announcement" | "reminder" | "alert" | "update";
  audience: "all" | "role" | "users";
  targetRoles?: UserRole[];
  targetUserIds?: string[];
  sentBy: string;
  sentAt: string;
  scheduledAt?: string;
  readCount: number;
  totalRecipients: number;
  status: "draft" | "scheduled" | "sent" | "cancelled";
}

/* ──────────────────────────────────────────────────────────────────────────
   SETTINGS / CONFIG TYPES
   ────────────────────────────────────────────────────────────────────────── */

export interface PlatformSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maxQuizAttempts: number;
    defaultTimeLimit: number;
    allowGuestAccess: boolean;
  };
  gamification: {
    coinsEnabled: boolean;
    streakEnabled: boolean;
    leaderboardEnabled: boolean;
    achievementsEnabled: boolean;
    dailyBonusAmount: number;
    streakBonusMultiplier: number;
  };
  security: {
    requireEmailVerification: boolean;
    mfaEnabled: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    passwordMinLength: number;
  };
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    digestFrequency: "realtime" | "hourly" | "daily";
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   API RESPONSE WRAPPERS
   ────────────────────────────────────────────────────────────────────────── */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}