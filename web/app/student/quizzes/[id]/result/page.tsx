"use client";

import { use } from "react";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { StudentLayout } from "@/components/student/StudentLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, Award, Clock } from "lucide-react";
import { formatDate } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function QuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { getById } = useQuizHistory();
  const { data: historyData, isLoading, isError } = getById(id);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading result...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (isError || !historyData) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-3xl dark:border-white/10 dark:bg-white/5 border-black/5 bg-black/5">
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Could not find the requested quiz result.
          </p>
          <Link href="/student" className="mt-4 text-violet-500 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </StudentLayout>
    );
  }

  // Assuming historyData matches QuizHistory type
  const result = historyData;
  const quiz = result.quiz;
  const answers = Array.isArray(result.answers) ? result.answers : [];
  
  // Use real passing score from the quiz, fallback to 70 if not available
  const passingScore = quiz?.passingScore ?? 70;
  const isPassing = result.score >= passingScore;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="p-2 rounded-full border bg-white hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Quiz Result</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {quiz?.title || "Quiz"}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-3xl border p-8 flex flex-col items-center text-center",
            isDark ? "bg-white/5 border-white/10" : "bg-white shadow-sm border-slate-200"
          )}
        >
          <div className="mb-6 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className={isDark ? "text-white/10" : "text-slate-100"}
              />
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={isPassing ? "text-green-500" : "text-amber-500"}
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * result.score) / 100}
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * result.score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">{result.score}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isPassing ? "Great Job!" : "Needs Improvement"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            You completed this quiz on {formatDate(result.completedAt)}.
          </p>
          
          <div className="flex gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                <p className="font-semibold">{result.score}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                <p className="font-semibold">{new Date(result.completedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {answers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold px-2">Detailed Feedback</h3>
            <div className="grid gap-4">
              {answers.map((answer: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    "p-5 rounded-2xl border",
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                        {answer.questionText || `Question ${index + 1}`}
                      </p>
                      <div className="text-sm space-y-1">
                        <p className={cn("flex gap-2", isDark ? "text-white/60" : "text-slate-600")}>
                          <span className="font-semibold min-w-[100px]">Your Answer:</span>
                          <span className={answer.isCorrect ? "text-green-500" : "text-red-500"}>
                            {answer.userAnswer || "N/A"}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p className={cn("flex gap-2", isDark ? "text-white/60" : "text-slate-600")}>
                            <span className="font-semibold min-w-[100px]">Correct Answer:</span>
                            <span className="text-green-500">{answer.correctAnswer || "N/A"}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
