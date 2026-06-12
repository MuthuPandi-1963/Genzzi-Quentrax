// components/student/HeroSection.tsx
// ── Dashboard hero with real user data ─────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Target, CheckCircle2, ClipboardList, Coins, Flame } from "lucide-react";
import { useAuthContext } from "@/context/auth.context";
import { ProgressRing } from "./ProgressRing";
import { formatCoins } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  avgScore: number;
  quizCount: number;
  pendingAssignments: number;
}

export function HeroSection({ avgScore, quizCount, pendingAssignments }: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const { user } = useAuthContext();
  const isDark = resolvedTheme === "dark";

  const name = user?.userProfile?.name || user?.username || "Student";
  const coins = user?.userProfile?.coins?.length ?? 0; // adjust based on your data
  const streak = 7; // fetch from API if available

  const stats = [
    { label: "Avg score", value: `${avgScore}%`, icon: Target, color: "hsl(263,70%,58%)" },
    { label: "Quizzes done", value: String(quizCount), icon: CheckCircle2, color: "hsl(142,76%,45%)" },
    { label: "Assessments due", value: String(pendingAssignments), icon: ClipboardList, color: "hsl(330,80%,60%)" },
    { label: "Coins", value: formatCoins(coins), icon: Coins, color: "hsl(45,95%,55%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-3xl border overflow-hidden relative",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[hsl(263,70%,58%)]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[hsl(330,80%,60%)]/8 blur-3xl" />
      </div>

      <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
        {/* Welcome text */}
        <div className="flex-1">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 border",
              isDark
                ? "bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/25 text-[hsl(142,76%,45%)]"
                : "bg-[hsl(142,76%,45%)]/8 border-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142,76%,45%)] animate-pulse inline-block" />
            Active learner
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-2">
            Hey, <span className="text-gradient">{name}</span> 👋
          </h1>
          <p className={cn("text-sm lg:text-base mb-6", isDark ? "text-white/55" : "text-gray-500")}>
            You've completed {quizCount} quizzes this week. Keep that streak alive!
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl border",
                  isDark ? "bg-white/5 border-white/10" : "bg-black/3 border-black/8"
                )}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}18` }}
                >
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-base font-black leading-none" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className={cn("text-[11px] mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress rings */}
        <div
          className={cn(
            "flex gap-6 lg:gap-8 p-5 rounded-2xl border flex-shrink-0",
            isDark ? "bg-white/3 border-white/8" : "bg-black/2 border-black/6"
          )}
        >
          <ProgressRing percent={avgScore} size={110} stroke={9} label="Avg Score" sublabel="this week" />
          <div className={cn("w-px", isDark ? "bg-white/8" : "bg-black/8")} />
          <ProgressRing
            percent={Math.round((quizCount / Math.max(quizCount + pendingAssignments, 1)) * 100)}
            size={110}
            stroke={9}
            label="Progress"
            sublabel="completed"
          />
        </div>
      </div>
    </motion.div>
  );
}