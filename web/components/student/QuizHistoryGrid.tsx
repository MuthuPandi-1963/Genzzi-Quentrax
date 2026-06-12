// components/student/QuizHistoryGrid.tsx
// ── Recent quiz attempts with score bars ─────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BookMarked, ChevronRight } from "lucide-react";
import type { QuizHistoryItem } from "@/@types/student";
import { formatDate, getScoreTailwind } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface QuizHistoryGridProps {
  quizzes: QuizHistoryItem[];
}

const diffBg = {
  easy: "bg-[hsl(142,76%,45%)]/12",
  medium: "bg-[hsl(45,95%,55%)]/12",
  hard: "bg-[hsl(0,84%,60%)]/12",
};

const diffColor = {
  easy: "text-[hsl(142,76%,45%)]",
  medium: "text-[hsl(45,95%,55%)]",
  hard: "text-[hsl(0,84%,60%)]",
};

export function QuizHistoryGrid({ quizzes }: QuizHistoryGridProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "rounded-3xl border p-5",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold">Recent Quizzes</h2>
          <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>
            Your last {quizzes.length} attempts
          </p>
        </div>
        <Link
          href="/student/progress/history"
          className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1"
        >
          Full history <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {quizzes.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            whileHover={{ y: -3, scale: 1.015 }}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
              isDark
                ? "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/14"
                : "bg-black/2 border-black/6 hover:bg-black/4"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", diffBg[q.difficulty], diffColor[q.difficulty])}>
                {q.difficulty}
              </span>
              <span className={cn("text-xl font-black", getScoreTailwind(q.score))}>{q.score}%</span>
            </div>
            <p className="text-sm font-semibold leading-snug mb-1">{q.quizTitle}</p>
            <div className={cn("flex items-center gap-2 text-[11px]", isDark ? "text-white/40" : "text-gray-400")}>
              <BookMarked className="w-3 h-3" />
              <span>{q.topicName}</span>
              <span>·</span>
              <span>{formatDate(q.completedAt)}</span>
            </div>
            <div className={cn("mt-3 h-1 rounded-full overflow-hidden", isDark ? "bg-white/8" : "bg-black/8")}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${q.score}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                style={{
                  background:
                    q.score >= 90 ? "hsl(142,76%,45%)" : q.score >= 70 ? "hsl(263,70%,58%)" : "hsl(45,95%,55%)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}