// lib/formatters.ts
// ── Pure formatting utilities ───────────────────────────────────────────────

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDateFull = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const daysUntil = (iso: string): number => {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatCoins = (coins: number): string => {
  return coins.toLocaleString();
};

export const getScoreColor = (score: number): string => {
  if (score >= 90) return "hsl(142,76%,45%)";
  if (score >= 70) return "hsl(263,70%,58%)";
  return "hsl(45,95%,55%)";
};

export const getScoreTailwind = (score: number): string => {
  if (score >= 90) return "text-[hsl(142,76%,45%)]";
  if (score >= 70) return "text-[hsl(263,70%,58%)]";
  return "text-[hsl(45,95%,55%)]";
};
// Add to existing lib/formatters.ts

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: "text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/12",
    inactive: "text-white/40 bg-white/8",
    blocked: "text-[hsl(0,84%,60%)] bg-[hsl(0,84%,60%)]/12",
    DRAFT: "text-white/40 bg-white/8",
    SCHEDULED: "text-[hsl(45,95%,55%)] bg-[hsl(45,95%,55%)]/12",
    ACTIVE: "text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/12",
    COMPLETED: "text-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/12",
  };
  return map[status] || "text-white/40 bg-white/8";
};

export const getRoleColor = (role: string): string => {
  const map: Record<string, string> = {
    ADMIN: "text-[hsl(330,80%,60%)] bg-[hsl(330,80%,60%)]/12",
    STAFF: "text-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/12",
    STUDENT: "text-[hsl(190,90%,50%)] bg-[hsl(190,90%,50%)]/12",
  };
  return map[role] || "text-white/40 bg-white/8";
};