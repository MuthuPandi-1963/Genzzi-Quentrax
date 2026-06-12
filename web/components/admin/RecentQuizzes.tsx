// components/admin/RecentQuizzes.tsx — Recently created/modified quizzes

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FileQuestion, Clock, Users, BarChart3, Eye, Edit3, MoreHorizontal } from "lucide-react";
import { useQuizzes } from "@/hooks/useAdmin";
import { getDifficultyColor, getStatusColor } from "@/lib/adminFormatters";
import { cn } from "@/lib/utils";

export function RecentQuizzes() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: quizzes, isLoading } = useQuizzes();

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-3xl border p-6 animate-pulse",
        isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="h-6 w-40 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
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
            isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
          )}>
            <FileQuestion className="w-5 h-5 text-[hsl(263,70%,58%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Recent Quizzes</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              Latest quiz activity
            </p>
          </div>
        </div>
        <button className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">
          View all
        </button>
      </div>

      <div className="space-y-2">
        {quizzes?.data.slice(0, 5).map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200 group",
              isDark
                ? "bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5"
                : "bg-black/2 border-black/5 hover:border-black/10 hover:bg-black/4"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                )}>
                  <FileQuestion className="w-5 h-5 text-[hsl(263,70%,58%)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{quiz.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                      getDifficultyColor(quiz.difficulty)
                    )}>
                      {quiz.difficulty}
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1", isDark ? "text-white/40" : "text-gray-400")}>
                      <Clock className="w-3 h-3" />
                      {quiz.timeLimit}m
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1", isDark ? "text-white/40" : "text-gray-400")}>
                      <FileQuestion className="w-3 h-3" />
                      {quiz.questionCount} Qs
                    </span>
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase",
                getStatusColor(quiz.status),
                "text-white"
              )}>
                {quiz.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={cn("text-[10px] flex items-center gap-1", isDark ? "text-white/50" : "text-gray-500")}>
                  <Users className="w-3 h-3 text-[hsl(263,70%,58%)]" />
                  {quiz.attempts} attempts
                </span>
                <span className={cn("text-[10px] flex items-center gap-1", isDark ? "text-white/50" : "text-gray-500")}>
                  <BarChart3 className="w-3 h-3 text-[hsl(142,76%,45%)]" />
                  {quiz.avgScore}% avg
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                )}>
                  <Eye className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                )}>
                  <Edit3 className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                )}>
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}