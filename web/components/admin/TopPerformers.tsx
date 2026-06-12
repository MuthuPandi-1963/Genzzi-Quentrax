// components/admin/TopPerformers.tsx — Leaderboard for top students

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Trophy, Medal, Flame, TrendingUp, Crown, Award, Star } from "lucide-react";
import { useLeaderboard } from "@/hooks/useAdmin";
import { getInitials } from "@/lib/adminFormatters";
import { cn } from "@/lib/utils";

const rankIcons = [Crown, Medal, Award];
const rankColors = [
  "from-[hsl(38,92%,55%)] to-[hsl(25,95%,55%)]",   // Gold
  "from-[hsl(217,20%,70%)] to-[hsl(217,20%,55%)]",  // Silver
  "from-[hsl(25,50%,50%)] to-[hsl(25,50%,40%)]",    // Bronze
];

export function TopPerformers() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-3xl border p-6 animate-pulse",
        isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="h-6 w-32 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3, 10) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "rounded-3xl border p-6",
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-black/5 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isDark ? "bg-white/10" : "bg-[hsl(38,92%,55%)]/10"
          )}>
            <Trophy className="w-5 h-5 text-[hsl(38,92%,55%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Top Performers</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              This week&apos;s highest achievers
            </p>
          </div>
        </div>
        <button className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">
          Full leaderboard
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 mb-6">
        {[1, 0, 2].map((idx) => {
          const entry = topThree[idx];
          if (!entry) return null;
          const RankIcon = rankIcons[idx] || Star;
          const height = idx === 0 ? "h-28" : idx === 1 ? "h-24" : "h-20";
          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.1, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold mb-2 shadow-lg",
                rankColors[idx]
              )}>
                <RankIcon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-center truncate w-20">{entry.userName}</p>
              <p className={cn("text-[10px]", isDark ? "text-white/50" : "text-gray-500")}>
                {entry.score.toLocaleString()} pts
              </p>
              <div className={cn(
                "w-16 rounded-t-xl mt-2",
                height,
                isDark ? "bg-white/10" : "bg-black/5"
              )} />
            </motion.div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-1">
        {rest.map((entry, i) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl transition-colors",
              isDark ? "hover:bg-white/5" : "hover:bg-black/5"
            )}
          >
            <span className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0",
              isDark ? "bg-white/10 text-white/70" : "bg-black/5 text-gray-600"
            )}>
              {entry.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {getInitials(entry.userName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entry.userName}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] flex items-center gap-0.5", isDark ? "text-white/50" : "text-gray-500")}>
                  <Flame className="w-3 h-3 text-[hsl(38,92%,55%)]" />
                  {entry.streak} day streak
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{entry.score.toLocaleString()}</p>
              <p className={cn("text-[10px] flex items-center gap-0.5 justify-end", isDark ? "text-white/40" : "text-gray-400")}>
                <TrendingUp className="w-3 h-3 text-[hsl(142,76%,45%)]" />
                +{entry.coins}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}