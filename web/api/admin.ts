// lib/api/admin.ts — Quentrax Admin API Layer
// Real fetch wrappers. Swap baseURL to your backend when ready.

import type {
  AdminUser,
  Quiz,
  Assessment,
  Transaction,
  LeaderboardEntry,
  DashboardStats,
  ActivityLog,
  NotificationItem,
} from "@/@types/admin";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ═══════════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetcher<DashboardStats>("/admin/dashboard/stats");
}

/* ═══════════════════════════════════════════════════════════════════════
   USERS
   ═══════════════════════════════════════════════════════════════════════ */

export async function getUsers(params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<{
  data: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const qs = new URLSearchParams();
  if (params?.role && params.role !== "all") qs.set("role", params.role);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  return fetcher(`/admin/users?${qs.toString()}`);
}

export async function getUserById(id: string): Promise<AdminUser> {
  return fetcher<AdminUser>(`/admin/users/${id}`);
}

export async function updateUserStatus(id: string, status: AdminUser["status"]): Promise<AdminUser> {
  return fetcher<AdminUser>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return fetcher<void>(`/admin/users/${id}`, { method: "DELETE" });
}

/* ═══════════════════════════════════════════════════════════════════════
   QUIZZES
   ═══════════════════════════════════════════════════════════════════════ */

export async function getQuizzes(params?: { status?: string; category?: string; page?: number; limit?: number }): Promise<{
  data: Quiz[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.category) qs.set("category", params.category);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  return fetcher(`/admin/quizzes?${qs.toString()}`);
}

export async function getQuizById(id: string): Promise<Quiz> {
  return fetcher<Quiz>(`/admin/quizzes/${id}`);
}

export async function createQuiz(data: Partial<Quiz>): Promise<Quiz> {
  return fetcher<Quiz>("/admin/quizzes", { method: "POST", body: JSON.stringify(data) });
}

export async function updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
  return fetcher<Quiz>(`/admin/quizzes/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteQuiz(id: string): Promise<void> {
  return fetcher<void>(`/admin/quizzes/${id}`, { method: "DELETE" });
}

/* ═══════════════════════════════════════════════════════════════════════
   ASSESSMENTS
   ═══════════════════════════════════════════════════════════════════════ */

export async function getAssessments(): Promise<Assessment[]> {
  return fetcher<Assessment[]>("/admin/assessments");
}

export async function getAssessmentById(id: string): Promise<Assessment> {
  return fetcher<Assessment>(`/admin/assessments/${id}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   TRANSACTIONS / COINS
   ═══════════════════════════════════════════════════════════════════════ */

export async function getTransactions(params?: { userId?: string; type?: string; limit?: number }): Promise<Transaction[]> {
  const qs = new URLSearchParams();
  if (params?.userId) qs.set("userId", params.userId);
  if (params?.type) qs.set("type", params.type);
  if (params?.limit) qs.set("limit", String(params.limit));
  return fetcher<Transaction[]>(`/admin/coins/transactions?${qs.toString()}`);
}

export async function awardCoins(userId: string, amount: number, reason: string): Promise<Transaction> {
  return fetcher<Transaction>("/admin/coins/award", {
    method: "POST",
    body: JSON.stringify({ userId, amount, reason }),
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   LEADERBOARD
   ═══════════════════════════════════════════════════════════════════════ */

export async function getLeaderboard(period: "daily" | "weekly" | "monthly" = "weekly", limit = 10): Promise<LeaderboardEntry[]> {
  return fetcher<LeaderboardEntry[]>(`/admin/leaderboard?period=${period}&limit=${limit}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   ACTIVITY LOGS
   ═══════════════════════════════════════════════════════════════════════ */

export async function getActivityLogs(limit = 20): Promise<ActivityLog[]> {
  return fetcher<ActivityLog[]>(`/admin/activity?limit=${limit}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════════════ */

export async function getNotifications(): Promise<NotificationItem[]> {
  return fetcher<NotificationItem[]>("/admin/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  return fetcher<void>(`/admin/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  return fetcher<void>("/admin/notifications/read-all", { method: "PATCH" });
}

/* ═══════════════════════════════════════════════════════════════════════
   APPROVALS
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApprovalItem {
  id: string;
  type: "user" | "quiz" | "content" | "report";
  title: string;
  subtitle: string;
  requestedBy: string;
  timeAgo: string;
  priority: "low" | "medium" | "high";
}

export async function getPendingApprovals(): Promise<ApprovalItem[]> {
  return fetcher<ApprovalItem[]>("/admin/approvals/pending");
}

export async function approveItem(id: string): Promise<void> {
  return fetcher<void>(`/admin/approvals/${id}/approve`, { method: "POST" });
}

export async function rejectItem(id: string, reason?: string): Promise<void> {
  return fetcher<void>(`/admin/approvals/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   SYSTEM HEALTH
   ═══════════════════════════════════════════════════════════════════════ */

export interface HealthMetric {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
  detail: string;
}

export async function getSystemHealth(): Promise<{ overall: number; metrics: HealthMetric[] }> {
  return fetcher<{ overall: number; metrics: HealthMetric[] }>("/admin/system/health");
}