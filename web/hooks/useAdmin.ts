// hooks/useAdminData.ts — Quentrax Admin React Query Hooks
// Production-ready: swap mock data for real API calls by uncommenting imports

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ApprovalItem, HealthMetric } from "@/api/admin";
import { Difficulty } from "@/@types/enums";

/* ═══════════════════════════════════════════════════════════════════════
   MOCK DATA GENERATORS (remove when API is ready)
   ═══════════════════════════════════════════════════════════════════════ */

const generateUsers = (count: number): AdminUser[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: ["Sarah Chen", "Marcus Johnson", "Aisha Patel", "David Kim", "Emma Wilson", "James Liu", "Olivia Brown", "Noah Garcia", "Sophia Martinez", "Liam Anderson", "Mia Thomas", "Ethan White"][i % 12],
    email: `user${i + 1}@quentrax.io`,
    role: ["ADMIN", "STAFF", "STUDENT", "STUDENT", "STAFF", "STUDENT"][i % 6] as AdminUser["role"],
    status: ["active", "active", "active", "active", "inactive", "banned"][i % 6] as AdminUser["status"],
    lastActive: i < 3 ? `${(i + 1) * 2} min ago` : i < 6 ? `${i - 2} hr ago` : `${i - 5} days ago`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    coins: Math.floor(Math.random() * 15000) + 100,
    quizzesTaken: Math.floor(Math.random() * 80) + 5,
    avgScore: Math.floor(Math.random() * 35) + 65,
  }));

const generateQuizzes = (count: number): Quiz[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `quiz-${i + 1}`,
    title: ["Advanced Physics", "Organic Chemistry", "World History", "Linear Algebra", "Shakespeare Literature", "Cell Biology", "Macroeconomics", "Data Structures"][i % 8],
    category: ["Physics", "Chemistry", "History", "Math", "Literature", "Biology", "Economics", "CS"][i % 8],
    difficulty: ([Difficulty.EASY,Difficulty.MEDIUM,Difficulty.HARD] as const)[i % 3],
    questionCount: [10, 15, 20, 25, 30, 50][i % 6],
    timeLimit: [15, 20, 30, 45, 60, 90][i % 6],
    attempts: Math.floor(Math.random() * 500) + 10,
    avgScore: Math.floor(Math.random() * 30) + 70,
    status: (["draft", "published", "published", "published", "archived"] as const)[i % 5],
    createdAt: new Date(Date.now() - Math.random() * 60 * 86400000).toISOString(),
  }));

const generateAssessments = (count: number): Assessment[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `assessment-${i + 1}`,
    title: ["Midterm Exam", "Final Assessment", "Quiz #3", "Lab Practical", "Term Paper"][i % 5],
    type: (["quiz", "exam", "assignment", "quiz", "exam"] as const)[i % 5],
    dueDate: new Date(Date.now() + (i - 2) * 86400000 * 7).toISOString(),
    totalStudents: 120 + i * 10,
    submittedCount: Math.floor(Math.random() * (120 + i * 10)),
    avgScore: Math.floor(Math.random() * 30) + 70,
    status: (["upcoming", "active", "active", "completed", "completed"] as const)[i % 5],
  }));

const generateTransactions = (count: number): Transaction[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `tx-${i + 1}`,
    userId: `user-${(i % 12) + 1}`,
    userName: ["Sarah Chen", "Marcus Johnson", "Aisha Patel", "David Kim", "Emma Wilson", "James Liu"][i % 6],
    type: (["earned", "earned", "spent", "bonus", "earned", "penalty"] as const)[i % 6],
    amount: [50, 100, -200, 500, 25, -50][i % 6],
    reason: ["Quiz completion", "Streak bonus", "Avatar purchase", "Weekly reward", "Daily login", "Cheating penalty"][i % 6],
    timestamp: i < 3 ? `${(i + 1) * 5}m ago` : i < 7 ? `${i - 2}h ago` : `${i - 6}d ago`,
  }));

const generateLeaderboard = (count: number): LeaderboardEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    userName: ["Sarah Chen", "Marcus Johnson", "Aisha Patel", "David Kim", "Emma Wilson", "James Liu", "Olivia Brown", "Noah Garcia", "Sophia Martinez", "Liam Anderson"][i % 10],
    score: Math.floor(Math.random() * 5000) + 5000 - i * 200,
    coins: Math.floor(Math.random() * 10000) + 2000 - i * 300,
    streak: Math.floor(Math.random() * 45) + 1,
  }));

const mockStats: DashboardStats = {
  totalUsers: 12847,
  activeQuizzes: 1234,
  assessments: 89,
  coinsDistributed: 2400000,
  userGrowth: 12,
  quizGrowth: 5,
  assessmentGrowth: -2,
  coinGrowth: 18,
};

const mockActivity: ActivityLog[] = [
  { id: "1", user: "Sarah Chen", action: "completed", target: "Advanced Physics Quiz", timestamp: "2 min ago", score: 95, type: "quiz" },
  { id: "2", user: "Marcus Johnson", action: "created", target: "New Assessment: CS Final", timestamp: "15 min ago", type: "user" },
  { id: "3", user: "Aisha Patel", action: "earned", target: "1,000 coins (7-day streak)", timestamp: "32 min ago", type: "user" },
  { id: "4", user: "System", action: "generated", target: "Weekly Analytics Report", timestamp: "1 hr ago", type: "system" },
  { id: "5", user: "David Kim", action: "flagged", target: "Suspicious activity on Quiz #442", timestamp: "2 hr ago", type: "security" },
  { id: "6", user: "Emma Wilson", action: "completed", target: "Organic Chemistry Lab", timestamp: "3 hr ago", score: 88, type: "quiz" },
  { id: "7", user: "James Liu", action: "joined", target: "the platform", timestamp: "4 hr ago", type: "user" },
  { id: "8", user: "System", action: "backed up", target: "Database snapshot", timestamp: "6 hr ago", type: "system" },
];

const mockNotifications: NotificationItem[] = [
  { id: "1", title: "New user registered", description: "james.liu@university.edu joined", timestamp: "2m ago", type: "user", read: false },
  { id: "2", title: "Quiz completed", description: "Sarah scored 95% on Advanced Physics", timestamp: "15m ago", type: "quiz", read: false },
  { id: "3", title: "Assessment deadline", description: "CS Final due in 2 hours (45 students)", timestamp: "1h ago", type: "alert", read: false },
  { id: "4", title: "Security alert", description: "New device login from Tokyo, JP", timestamp: "3h ago", type: "security", read: false },
  { id: "5", title: "Quiz published", description: "World History Quiz is now live", timestamp: "5h ago", type: "quiz", read: true },
];

const mockApprovals: ApprovalItem[] = [
  { id: "1", type: "user", title: "New Teacher Account", subtitle: "john.doe@school.edu", requestedBy: "Registration System", timeAgo: "5m ago", priority: "medium" },
  { id: "2", type: "quiz", title: "Advanced Physics Quiz", subtitle: "15 questions • Hard difficulty", requestedBy: "Dr. Sarah Chen", timeAgo: "12m ago", priority: "high" },
  { id: "3", type: "content", title: "Question #4,291", subtitle: "Flagged by auto-moderator", requestedBy: "Auto-moderator", timeAgo: "28m ago", priority: "low" },
  { id: "4", type: "report", title: "Cheating Report", subtitle: "User #8821 • Quiz #442", requestedBy: "System", timeAgo: "1h ago", priority: "high" },
  { id: "5", type: "quiz", title: "History Final Exam", subtitle: "50 questions • 90 minutes", requestedBy: "Prof. Marcus J.", timeAgo: "2h ago", priority: "medium" },
];

const mockHealthMetrics: HealthMetric[] = [
  { name: "API Server", value: 99.9, status: "healthy", detail: "3ms avg response time" },
  { name: "Database", value: 97.5, status: "healthy", detail: "142ms query time" },
  { name: "WebSocket", value: 100, status: "healthy", detail: "2,847 active connections" },
  { name: "Redis Cache", value: 94.2, status: "healthy", detail: "12ms avg latency" },
  { name: "CPU Usage", value: 68, status: "warning", detail: "4/8 cores active (68%)" },
  { name: "Memory", value: 82, status: "warning", detail: "13.1 / 16 GB used" },
];

/* ═══════════════════════════════════════════════════════════════════════
   REAL API IMPORTS (uncomment when backend is ready)
   ═══════════════════════════════════════════════════════════════════════ */

// import {
//   getDashboardStats as apiGetDashboardStats,
//   getUsers as apiGetUsers,
//   getQuizzes as apiGetQuizzes,
//   getAssessments as apiGetAssessments,
//   getTransactions as apiGetTransactions,
//   getLeaderboard as apiGetLeaderboard,
//   getActivityLogs as apiGetActivityLogs,
//   getNotifications as apiGetNotifications,
//   getPendingApprovals as apiGetPendingApprovals,
//   getSystemHealth as apiGetSystemHealth,
//   approveItem as apiApproveItem,
//   rejectItem as apiRejectItem,
//   markNotificationRead as apiMarkNotificationRead,
//   markAllNotificationsRead as apiMarkAllNotificationsRead,
//   awardCoins as apiAwardCoins,
// } from "@/lib/api/admin";

/* ═══════════════════════════════════════════════════════════════════════
   QUERY HOOKS
   ═══════════════════════════════════════════════════════════════════════ */

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // return apiGetDashboardStats();
      await new Promise((r) => setTimeout(r, 600));
      return mockStats;
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useUsers(params?: { role?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      // return apiGetUsers(params);
      await new Promise((r) => setTimeout(r, 800));
      let users = generateUsers(50);
      if (params?.role && params.role !== "all") {
        users = users.filter((u) => u.role === params.role);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      return {
        data: users.slice((page - 1) * limit, page * limit),
        total: users.length,
        page,
        totalPages: Math.ceil(users.length / limit),
      };
    },
  });
}

export function useQuizzes(params?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: ["admin", "quizzes", params],
    queryFn: async () => {
      // return apiGetQuizzes(params);
      await new Promise((r) => setTimeout(r, 700));
      let quizzes = generateQuizzes(24);
      if (params?.status) quizzes = quizzes.filter((q) => q.status === params.status);
      if (params?.category) quizzes = quizzes.filter((q) => q.category === params.category);
      return { data: quizzes, total: quizzes.length, page: 1, totalPages: 1 };
    },
  });
}

export function useAssessments() {
  return useQuery({
    queryKey: ["admin", "assessments"],
    queryFn: async () => {
      // return apiGetAssessments();
      await new Promise((r) => setTimeout(r, 500));
      return generateAssessments(12);
    },
  });
}

export function useTransactions(params?: { userId?: string; type?: string; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "transactions", params],
    queryFn: async () => {
      // return apiGetTransactions(params);
      await new Promise((r) => setTimeout(r, 900));
      let txs = generateTransactions(20);
      if (params?.userId) txs = txs.filter((t) => t.userId === params.userId);
      if (params?.type) txs = txs.filter((t) => t.type === params.type);
      if (params?.limit) txs = txs.slice(0, params.limit);
      return txs;
    },
  });
}

export function useLeaderboard(period: "daily" | "weekly" | "monthly" = "weekly", limit = 10) {
  return useQuery({
    queryKey: ["admin", "leaderboard", period, limit],
    queryFn: async () => {
      // return apiGetLeaderboard(period, limit);
      await new Promise((r) => setTimeout(r, 400));
      return generateLeaderboard(limit);
    },
    refetchInterval: 60000,
  });
}

export function useActivity(limit = 20) {
  return useQuery({
    queryKey: ["admin", "activity", limit],
    queryFn: async () => {
      // return apiGetActivityLogs(limit);
      await new Promise((r) => setTimeout(r, 300));
      return mockActivity.slice(0, limit);
    },
    refetchInterval: 10000, // Live feel — refresh every 10s
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      // return apiGetNotifications();
      await new Promise((r) => setTimeout(r, 200));
      return mockNotifications;
    },
    refetchInterval: 15000,
  });
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: ["admin", "approvals", "pending"],
    queryFn: async () => {
      // return apiGetPendingApprovals();
      await new Promise((r) => setTimeout(r, 500));
      return mockApprovals;
    },
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin", "system", "health"],
    queryFn: async () => {
      // const data = await apiGetSystemHealth();
      // return data;
      await new Promise((r) => setTimeout(r, 400));
      const overall = Math.round(
        mockHealthMetrics.reduce((acc, m) => acc + m.value, 0) / mockHealthMetrics.length
      );
      return { overall, metrics: mockHealthMetrics };
    },
    refetchInterval: 10000,
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   MUTATION HOOKS
   ═══════════════════════════════════════════════════════════════════════ */

export function useApproveItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // return apiApproveItem(id);
      await new Promise((r) => setTimeout(r, 400));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "approvals"] });
      qc.invalidateQueries({ queryKey: ["admin", "activity"] });
    },
  });
}

export function useRejectItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      // return apiRejectItem(id, reason);
      await new Promise((r) => setTimeout(r, 400));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "approvals"] });
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // return apiMarkNotificationRead(id);
      await new Promise((r) => setTimeout(r, 200));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // return apiMarkAllNotificationsRead();
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useAwardCoins() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, amount, reason }: { userId: string; amount: number; reason: string }) => {
      // return apiAwardCoins(userId, amount, reason);
      await new Promise((r) => setTimeout(r, 500));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AdminUser["status"] }) => {
      // return apiUpdateUserStatus(id, status);
      await new Promise((r) => setTimeout(r, 400));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}