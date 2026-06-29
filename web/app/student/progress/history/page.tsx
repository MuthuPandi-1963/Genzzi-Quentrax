"use client";

import { useStudentStats } from "@/hooks/useStudent";
import { StudentLayout } from "@/components/student/StudentLayout";
import { motion } from "framer-motion";
import { BookMarked, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { formatDate, getScoreTailwind } from "@/lib/formatter";
import { useState } from "react";
import Link from "next/link";

const diffBg: Record<string, string> = {
  easy: "bg-[hsl(142,76%,45%)]/12",
  medium: "bg-[hsl(45,95%,55%)]/12",
  hard: "bg-[hsl(0,84%,60%)]/12",
};

const diffColor: Record<string, string> = {
  easy: "text-[hsl(142,76%,45%)]",
  medium: "text-[hsl(45,95%,55%)]",
  hard: "text-[hsl(0,84%,60%)]",
};

export default function StudentHistoryPage() {
  const { quizHistory, isLoading } = useStudentStats();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading your history...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const filteredHistory = quizHistory.filter(q => 
    q.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Quiz History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Browse your past quiz attempts and review your results.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                isDark ? "bg-white/5 border-white/10 focus:border-violet-500" : "bg-white border-black/10 focus:border-violet-500"
              )}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredHistory.length === 0 ? (
            <div className="col-span-full py-20 text-center border rounded-3xl dark:border-white/10 dark:bg-white/5 border-black/5 bg-black/5">
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                No quizzes found.
              </p>
            </div>
          ) : (
            filteredHistory.map((q, i) => (
              <Link href={`/student/results/${q.id}`} key={q.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-200 cursor-pointer h-full flex flex-col",
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      : "bg-white border-black/10 hover:shadow-lg shadow-sm"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider", diffBg[q.difficulty] || "bg-slate-100", diffColor[q.difficulty] || "text-slate-500")}>
                      {q.difficulty}
                    </span>
                    <span className={cn("text-2xl font-black", getScoreTailwind(q.score))}>{q.score}%</span>
                  </div>
                  <h3 className="text-base font-bold leading-snug mb-2 flex-1">{q.quizTitle}</h3>
                  <div className={cn("flex items-center gap-2 text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                    <BookMarked className="w-3.5 h-3.5" />
                    <span className="truncate">{q.topicName}</span>
                  </div>
                  <div className={cn("text-[10px] mt-2 font-medium uppercase tracking-widest", isDark ? "text-white/30" : "text-gray-400")}>
                    {formatDate(q.completedAt)}
                  </div>
                  
                  <div className={cn("mt-4 h-1.5 rounded-full overflow-hidden", isDark ? "bg-white/10" : "bg-black/10")}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${q.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                      style={{
                        background:
                          q.score >= 90 ? "hsl(142,76%,45%)" : q.score >= 70 ? "hsl(263,70%,58%)" : "hsl(0,84%,60%)",
                      }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </motion.div>
      </div>
    </StudentLayout>
  );
}
