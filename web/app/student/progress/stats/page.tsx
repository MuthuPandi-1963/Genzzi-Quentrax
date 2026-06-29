"use client";

import { useStudentStats } from "@/hooks/useStudent";
import { StudentLayout } from "@/components/student/StudentLayout";
import { CoinsWidget } from "@/components/student/CoinsWidget";
import { StreakCard } from "@/components/student/StreakCard";
import { motion } from "framer-motion";
import { Trophy, Target, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function StudentStatsPage() {
  const { stats, quizHistory, coinsHistory, isLoading } = useStudentStats();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading your stats...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const avgScore = quizHistory.length
    ? Math.round(quizHistory.reduce((a, q) => a + q.score, 0) / quizHistory.length)
    : 0;

  const totalQuizzes = quizHistory.length;
  const passedQuizzes = quizHistory.filter(q => q.score >= 60).length;

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Your Performance Stats
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Dive deep into your learning metrics and track your continuous growth.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Total Quizzes */}
          <div className={cn("p-6 rounded-3xl border", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-sm">Quizzes Taken</h3>
            </div>
            <p className="text-4xl font-black">{totalQuizzes}</p>
          </div>

          {/* Average Score */}
          <div className={cn("p-6 rounded-3xl border", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-sm">Average Score</h3>
            </div>
            <p className="text-4xl font-black">{avgScore}%</p>
          </div>

          {/* Passed Quizzes */}
          <div className={cn("p-6 rounded-3xl border", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-sm">Quizzes Passed</h3>
            </div>
            <p className="text-4xl font-black">{passedQuizzes}</p>
          </div>

          {/* Time Spent (Mock metric) */}
          <div className={cn("p-6 rounded-3xl border", isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 text-sm">Active Days</h3>
            </div>
            <p className="text-4xl font-black">{stats?.streak || 0}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CoinsWidget balance={stats?.coins ?? 0} history={coinsHistory} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StreakCard streak={stats?.streak ?? 0} />
          </motion.div>
        </div>
      </div>
    </StudentLayout>
  );
}
