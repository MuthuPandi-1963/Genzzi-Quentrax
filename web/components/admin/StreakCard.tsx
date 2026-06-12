// components/admin/StreakCard.tsx — Platform uptime streak tracker

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Flame, Zap, Target, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function StreakCard() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Platform metrics (replace with real data hook when ready)
  const currentStreak = 47;
  const bestStreak = 120;
  const weeklyActive = [true, true, true, true, false, true, false];
  const dailyActiveUsers = 2847;
  const dailyGrowth = 12.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className={cn(
        "rounded-3xl border p-6",
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-black/5 shadow-lg"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isDark ? "bg-white/10" : "bg-[hsl(38,92%,55%)]/10"
          )}>
            <Flame className="w-5 h-5 text-[hsl(38,92%,55%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Platform Streak</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              Uptime & daily engagement
            </p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold",
          "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)]"
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(38,92%,55%)] animate-pulse" />
          {currentStreak} DAYS
        </div>
      </div>

      {/* Main Ring */}
      <div className="flex items-center justify-center mb-6">
        <ProgressRing
          progress={(currentStreak / bestStreak) * 100}
          size={150}
          strokeWidth={12}
          color="hsl(38,92%,55%)"
          trackColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
        >
          <div className="text-center">
            <Zap className="w-7 h-7 text-[hsl(38,92%,55%)] mx-auto mb-1" />
            <p className="text-3xl font-black text-[hsl(38,92%,55%)]">{currentStreak}</p>
            <p className={cn("text-[10px] uppercase tracking-wider mt-0.5", isDark ? "text-white/50" : "text-gray-500")}>
              Day Streak
            </p>
            <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/30" : "text-gray-400")}>
              Best: {bestStreak}
            </p>
          </div>
        </ProgressRing>
      </div>

      {/* Weekly Tracker */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className={cn("text-xs font-semibold", isDark ? "text-white/70" : "text-gray-700")}>
            This Week
          </span>
          <span className={cn("text-[10px]", isDark ? "text-white/40" : "text-gray-400")}>
            {weeklyActive.filter(Boolean).length}/7 active
          </span>
        </div>
        <div className="flex items-center justify-between">
          {weekDays.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: weeklyActive[i] ? 1 : 0.9,
                  backgroundColor: weeklyActive[i]
                    ? "hsl(38, 92%, 55%)"
                    : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                }}
                whileHover={{ scale: 1.15 }}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors cursor-pointer",
                  weeklyActive[i] ? "text-white shadow-lg shadow-[hsl(38,92%,55%)]/20" : isDark ? "text-white/30" : "text-gray-400"
                )}
              >
                {weeklyActive[i] ? <Target className="w-4 h-4" /> : <span className="text-[10px]">{day[0]}</span>}
              </motion.div>
              <span className={cn(
                "text-[9px] font-medium",
                isDark ? "text-white/40" : "text-gray-400"
              )}>
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cn(
          "p-3 rounded-2xl border",
          isDark ? "bg-white/3 border-white/10" : "bg-black/2 border-black/5"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]" />
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-500")}>
              Today
            </span>
          </div>
          <p className="text-lg font-bold">{dailyActiveUsers.toLocaleString()}</p>
          <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-gray-400")}>active users</p>
        </div>
        <div className={cn(
          "p-3 rounded-2xl border",
          isDark ? "bg-white/3 border-white/10" : "bg-black/2 border-black/5"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-500")}>
              Growth
            </span>
          </div>
          <p className="text-lg font-bold text-[hsl(142,76%,45%)]">+{dailyGrowth}%</p>
          <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-gray-400")}>vs yesterday</p>
        </div>
      </div>

      {/* Insight */}
      <div className={cn(
        "flex items-start gap-2 p-3 rounded-2xl border",
        isDark
          ? "bg-[hsl(38,92%,55%)]/5 border-[hsl(38,92%,55%)]/20"
          : "bg-[hsl(38,92%,55%)]/5 border-[hsl(38,92%,55%)]/10"
      )}>
        <ArrowUpRight className="w-4 h-4 text-[hsl(38,92%,55%)] mt-0.5 shrink-0" />
        <p className={cn("text-xs leading-relaxed", isDark ? "text-white/70" : "text-gray-600")}>
          <span className="font-semibold text-[hsl(38,92%,55%)]">Peak time:</span> 2:00–4:00 PM. Consider scheduling new content drops during this window.
        </p>
      </div>
    </motion.div>
  );
}