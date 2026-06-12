// components/student/AvailableQuizzes.tsx
// ── Quizzes ready to take ──────────────────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Clock, BookOpen, Star, ChevronRight } from "lucide-react";
import type { AvailableQuizItem } from "@/@types/student";
import { cn } from "@/lib/utils";

interface AvailableQuizzesProps {
  quizzes: AvailableQuizItem[];
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

export function AvailableQuizzes({ quizzes }: AvailableQuizzesProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 }}
      className={cn(
        "rounded-3xl border p-5",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold">Available Quizzes</h2>
          <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>Jump in anytime</p>
        </div>
        <Link
          href="/student/quizzes"
          className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1"
        >
          Browse all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {quizzes.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 + i * 0.07 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 group cursor-pointer",
              isDark
                ? "bg-white/3 border-white/8 hover:border-[hsl(263,70%,58%)]/30 hover:bg-[hsl(263,70%,58%)]/6"
                : "bg-black/2 border-black/6 hover:border-[hsl(263,70%,58%)]/25 hover:bg-[hsl(263,70%,58%)]/4"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", diffBg[q.difficulty], diffColor[q.difficulty])}>
                {q.difficulty}
              </span>
              <div className="flex items-center gap-1 text-[hsl(263,70%,58%)]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold">{q.totalPoints}</span>
              </div>
            </div>
            <p className="text-sm font-semibold mb-1 leading-snug">{q.title}</p>
            <p className={cn("text-xs mb-3", isDark ? "text-white/45" : "text-gray-500")}>{q.topicName}</p>
            <div className={cn("flex items-center gap-3 text-[11px] mb-4", isDark ? "text-white/40" : "text-gray-400")}>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {q.timeLimit}m
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {q.questionCount} Qs
              </span>
            </div>
            <button
              className={cn(
                "w-full py-2 rounded-xl text-xs font-bold border transition-all duration-200",
                "text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/30 bg-[hsl(263,70%,58%)]/8",
                "hover:bg-[hsl(263,70%,58%)]/15 hover:border-[hsl(263,70%,58%)]/50 group-hover:shadow-[0_0_12px_-2px_hsl(263,70%,58%/0.2)]"
              )}
            >
              Start Quiz
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}