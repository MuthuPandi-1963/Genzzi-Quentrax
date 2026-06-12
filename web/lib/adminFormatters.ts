// lib/adminFormatters.ts — Quentrax Admin Panel Pure Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/* ──────────────────────────────────────────────────────────────────────────
   NUMBER FORMATTING
   ────────────────────────────────────────────────────────────────────────── */

export function formatNumber(num: number | undefined | null): string {
  if (num == null) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString("en-US");
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}

export function formatCurrency(amount: number | undefined): string {
  if (amount == null) return "0";
  const abs = Math.abs(amount);
  const prefix = amount < 0 ? "−" : "+";
  return `${prefix}${formatNumber(abs)}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ──────────────────────────────────────────────────────────────────────────
   DATE / TIME FORMATTING
   ────────────────────────────────────────────────────────────────────────── */

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeTime(timestamp: string): string {
  // Already relative strings like "2m ago", "1h ago" pass through
  if (/^\d+[smhd]\s+ago$/.test(timestamp)) return timestamp;

  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(then);
}

export function formatTimeAgo(date: string | Date): string {
  return formatRelativeTime(typeof date === "string" ? date : date.toISOString());
}

/* ──────────────────────────────────────────────────────────────────────────
   STRING / TEXT FORMATTING
   ────────────────────────────────────────────────────────────────────────── */

export function getInitials(name: string | undefined): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* ──────────────────────────────────────────────────────────────────────────
   STATUS / BADGE COLOR HELPERS
   ────────────────────────────────────────────────────────────────────────── */

export function getStatusColor(status: string | undefined): string {
  const colors: Record<string, string> = {
    // User statuses
    active: "bg-[hsl(142,76%,45%)]",
    inactive: "bg-[hsl(38,92%,55%)]",
    banned: "bg-[hsl(0,84%,60%)]",
    // Quiz statuses
    draft: "bg-[hsl(38,92%,55%)]",
    published: "bg-[hsl(142,76%,45%)]",
    archived: "bg-[hsl(217,90%,60%)]",
    // Assessment statuses
    upcoming: "bg-[hsl(263,70%,58%)]",
    completed: "bg-[hsl(217,90%,60%)]",
    graded: "bg-[hsl(330,80%,60%)]",
    // Approval statuses
    pending: "bg-[hsl(38,92%,55%)]",
    approved: "bg-[hsl(142,76%,45%)]",
    rejected: "bg-[hsl(0,84%,60%)]",
    escalated: "bg-[hsl(330,80%,60%)]",
    // Health statuses
    healthy: "bg-[hsl(142,76%,45%)]",
    warning: "bg-[hsl(38,92%,55%)]",
    critical: "bg-[hsl(0,84%,60%)]",
    unknown: "bg-gray-500",
    // Generic
    online: "bg-[hsl(142,76%,45%)]",
    offline: "bg-[hsl(217,20%,60%)]",
    error: "bg-[hsl(0,84%,60%)]",
  };
  return colors[status ?? ""] || "bg-gray-500";
}

export function getStatusTextColor(status: string | undefined): string {
  const colors: Record<string, string> = {
    active: "text-[hsl(142,76%,45%)]",
    inactive: "text-[hsl(38,92%,55%)]",
    banned: "text-[hsl(0,84%,60%)]",
    draft: "text-[hsl(38,92%,55%)]",
    published: "text-[hsl(142,76%,45%)]",
    archived: "text-[hsl(217,90%,60%)]",
    upcoming: "text-[hsl(263,70%,58%)]",
    completed: "text-[hsl(217,90%,60%)]",
    graded: "text-[hsl(330,80%,60%)]",
    pending: "text-[hsl(38,92%,55%)]",
    approved: "text-[hsl(142,76%,45%)]",
    rejected: "text-[hsl(0,84%,60%)]",
    healthy: "text-[hsl(142,76%,45%)]",
    warning: "text-[hsl(38,92%,55%)]",
    critical: "text-[hsl(0,84%,60%)]",
  };
  return colors[status ?? ""] || "text-gray-500";
}

export function getDifficultyColor(difficulty: string | undefined): string {
  const colors: Record<string, string> = {
    easy: "text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/20",
    medium: "text-[hsl(38,92%,55%)] bg-[hsl(38,92%,55%)]/10 border-[hsl(38,92%,55%)]/20",
    hard: "text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%)]/10 border-[hsl(0,84%,60%)]/20",
  };
  return colors[difficulty ?? ""] || "text-gray-500 bg-gray-500/10 border-gray-500/20";
}

export function getRoleColor(role: string | undefined): string {
  const colors: Record<string, string> = {
    ADMIN: "bg-[hsl(330,80%,60%)]/15 text-[hsl(330,80%,60%)] border-[hsl(330,80%,60%)]/20",
    STAFF: "bg-[hsl(263,70%,58%)]/15 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
    STUDENT: "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/20",
  };
  return colors[role ?? ""] || "bg-gray-500/15 text-gray-500 border-gray-500/20";
}

export function getPriorityColor(priority: string | undefined): string {
  const colors: Record<string, string> = {
    low: "bg-[hsl(217,90%,60%)]/15 text-[hsl(217,90%,60%)] border-[hsl(217,90%,60%)]/20",
    medium: "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)] border-[hsl(38,92%,55%)]/20",
    high: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)] border-[hsl(0,84%,60%)]/20",
    critical: "bg-[hsl(330,80%,60%)]/15 text-[hsl(330,80%,60%)] border-[hsl(330,80%,60%)]/20",
  };
  return colors[priority ?? ""] || "bg-gray-500/15 text-gray-500 border-gray-500/20";
}

export function getTransactionColor(type: string | undefined): string {
  const colors: Record<string, string> = {
    earned: "text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/10",
    spent: "text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%)]/10",
    bonus: "text-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10",
    penalty: "text-[hsl(38,92%,55%)] bg-[hsl(38,92%,55%)]/10",
    refund: "text-[hsl(217,90%,60%)] bg-[hsl(217,90%,60%)]/10",
  };
  return colors[type ?? ""] || "text-gray-500 bg-gray-500/10";
}

export function getNotificationColor(type: string | undefined): string {
  const colors: Record<string, string> = {
    user: "bg-[hsl(142,76%,45%)]",
    quiz: "bg-[hsl(263,70%,58%)]",
    alert: "bg-[hsl(38,92%,55%)]",
    security: "bg-[hsl(0,84%,60%)]",
    system: "bg-[hsl(217,90%,60%)]",
    achievement: "bg-[hsl(330,80%,60%)]",
  };
  return colors[type ?? ""] || "bg-gray-500";
}

/* ──────────────────────────────────────────────────────────────────────────
   SCORE / PERFORMANCE HELPERS
   ────────────────────────────────────────────────────────────────────────── */

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-[hsl(142,76%,45%)]";
  if (score >= 70) return "text-[hsl(38,92%,55%)]";
  if (score >= 50) return "text-[hsl(263,70%,58%)]";
  return "text-[hsl(0,84%,60%)]";
}

export function getScoreBg(score: number): string {
  if (score >= 90) return "bg-[hsl(142,76%,45%)]/15";
  if (score >= 70) return "bg-[hsl(38,92%,55%)]/15";
  if (score >= 50) return "bg-[hsl(263,70%,58%)]/15";
  return "bg-[hsl(0,84%,60%)]/15";
}

export function getTrendIcon(trend: "up" | "down" | "same"): string {
  return trend; // Components use this to pick ArrowUpRight / ArrowDownRight / Minus
}

export function getTrendColor(trend: "up" | "down" | "same"): string {
  if (trend === "up") return "text-[hsl(142,76%,45%)]";
  if (trend === "down") return "text-[hsl(0,84%,60%)]";
  return "text-gray-500";
}

/* ──────────────────────────────────────────────────────────────────────────
   VALIDATION / SANITIZATION
   ────────────────────────────────────────────────────────────────────────── */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

/* ──────────────────────────────────────────────────────────────────────────
   ARRAY / OBJECT HELPERS
   ────────────────────────────────────────────────────────────────────────── */

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const group = String(item[key]);
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: "asc" | "desc" = "desc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null || bVal == null) return 0;
    const cmp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return order === "desc" ? -cmp : cmp;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set<string>();
  return array.filter((item) => {
    const val = String(item[key]);
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}