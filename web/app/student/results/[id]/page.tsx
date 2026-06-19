"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Award,
  XCircle,
  CheckCircle2,
  ArrowLeft,
  Home,
  Loader2,
  RotateCcw,
  Trophy,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";

import { QuizHistoryAPI } from "@/api/quiz-history";
import { useQuizById } from "@/hooks/useQuizzes";
import { QuizHistory } from "@/@types/QuizHistory";
import { AnswerState } from "@/@types/Quiz";

// ── Lazy-load chart (no SSR) ──────────────────────────────────
const ResultsChart = dynamic(
  () => import("@/components/assessment/ResultsChart"),
  {
    loading: () => (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Loading chart…
      </div>
    ),
    ssr: false,
  }
);

// ─────────────────────────────────────────────────────────────
export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = params.id as string;

  // ── 1. Fetch quiz history by ID ──────────────────────────
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["quiz-history", historyId],
    queryFn: async () => {
      const res = await QuizHistoryAPI.getById(historyId);
      // API wrapper: res.data may be { data: QuizHistory } or QuizHistory directly
      return (res.data?.data ?? res.data) as QuizHistory;
    },
    enabled: !!historyId,
    staleTime: 1000 * 60 * 5,
  });

  const quizId = historyData?.quizId ?? "";

  // ── 2. Fetch full quiz (questions, totalPoints, etc.) ────
  const { data: quizData, isLoading: isQuizLoading } = useQuizById(quizId);

  // ── 3. Derived values ────────────────────────────────────
  const isLoading = isHistoryLoading || (!!quizId && isQuizLoading);

  // Prefer the quiz embedded in history; fall back to separate fetch
  const quiz = historyData?.quiz ?? quizData;
  const answers = (historyData?.answers ?? {}) as AnswerState;

  const score = historyData?.score ?? 0;
  const totalPoints = quiz?.totalPoints ?? 0;
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const passed = percentage >= 60;

  const questions = quiz?.questions ?? [];

  const answeredCount = Object.values(answers).filter(
    (a) => (a.status === "answered" || a.status === "flagged") && a.value !== null
  ).length;
  const flaggedCount = Object.values(answers).filter((a) => a.status === "flagged").length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const completedAt = historyData?.completedAt
    ? new Date(historyData.completedAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Loading your results…
          </p>
        </div>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────
  if (isHistoryError || !historyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Result Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          We couldn't load this quiz result. It may have been removed or the link
          is incorrect.
        </p>
        <button
          onClick={() => router.push("/student/quizzes")}
          className="mt-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,50%,4%)] pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Nav ───────────────────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/student/quizzes")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </button>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* ── Hero Result Card ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`rounded-3xl p-8 md:p-12 mb-8 text-center text-white relative overflow-hidden shadow-2xl ${
            passed
              ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
              : "bg-gradient-to-br from-red-500 via-rose-500 to-orange-600"
          }`}
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-xl"
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
              ) : (
                <RotateCcw className="w-12 h-12 text-white drop-shadow-lg" />
              )}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-black mb-2 drop-shadow"
            >
              {passed ? "Congratulations! 🎉" : "Keep Going! 💪"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90 mb-8 font-medium"
            >
              You scored <strong>{percentage}%</strong> on{" "}
              <strong>{quiz?.title ?? "the quiz"}</strong>
            </motion.p>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center w-full max-w-2xl bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="flex-1 min-w-[120px] p-5 border-r border-white/10">
                <div className="flex items-center justify-center gap-1.5 mb-1 opacity-80">
                  <Target className="w-3.5 h-3.5" />
                  <p className="text-xs uppercase tracking-wider font-bold">Score</p>
                </div>
                <p className="text-3xl font-black">
                  {score}
                  <span className="text-xl opacity-70"> / {totalPoints}</span>
                </p>
              </div>

              <div className="flex-1 min-w-[120px] p-5 border-r border-white/10">
                <div className="flex items-center justify-center gap-1.5 mb-1 opacity-80">
                  <Award className="w-3.5 h-3.5" />
                  <p className="text-xs uppercase tracking-wider font-bold">Percentage</p>
                </div>
                <p className="text-3xl font-black">{percentage}%</p>
              </div>

              <div className="flex-1 min-w-[140px] p-5">
                <div className="flex items-center justify-center gap-1.5 mb-1 opacity-80">
                  <Clock className="w-3.5 h-3.5" />
                  <p className="text-xs uppercase tracking-wider font-bold">Completed</p>
                </div>
                <p className="text-sm font-bold pt-1">{completedAt}</p>
              </div>
            </motion.div>

            {/* Pass / Fail pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 }}
              className={`mt-6 px-6 py-2 rounded-full font-bold text-sm border border-white/30 backdrop-blur-sm ${
                passed ? "bg-white/20" : "bg-black/20"
              }`}
            >
              {passed ? "✅ PASSED" : "❌ NOT PASSED"} — minimum 60% required
            </motion.div>
          </div>
        </motion.div>

        {/* ── Answer Distribution Chart ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <ResultsChart
            correct={answeredCount - flaggedCount}
            incorrect={flaggedCount}
            unanswered={unansweredCount}
            total={Math.max(questions.length, 1)}
          />
        </motion.div>

        {/* ── Quick Stats Row ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              label: "Total Questions",
              value: questions.length,
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20",
            },
            {
              label: "Answered",
              value: answeredCount,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20",
            },
            {
              label: "Skipped",
              value: unansweredCount,
              color: "text-gray-500 dark:text-gray-400",
              bg: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className={`rounded-2xl border p-5 text-center ${stat.bg}`}
            >
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Question Breakdown ────────────────────────────── */}
        {questions.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Question Breakdown
              </h2>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => {
                const ans = answers[q.id];
                const hasAnswer =
                  ans &&
                  (ans.status === "answered" || ans.status === "flagged") &&
                  ans.value !== null &&
                  ans.value !== undefined;
                const isFlagged = ans?.status === "flagged";

                const raw = ans?.value;
                const displayAnswer = Array.isArray(raw)
                  ? raw.join(", ")
                  : raw !== null && raw !== undefined
                  ? String(raw)
                  : null;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.04 }}
                    className={`bg-white dark:bg-white/5 rounded-2xl shadow-sm overflow-hidden border-l-4 ${
                      hasAnswer
                        ? isFlagged
                          ? "border-l-amber-400 border-t border-b border-r border-black/5 dark:border-white/5"
                          : "border-l-purple-500 border-t border-b border-r border-black/5 dark:border-white/5"
                        : "border-l-gray-300 dark:border-l-gray-700 border-t border-b border-r border-black/5 dark:border-white/5"
                    }`}
                  >
                    <div className="p-6 flex flex-col md:flex-row gap-5">
                      {/* Index badge */}
                      <div className="flex-shrink-0 pt-0.5">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            hasAnswer
                              ? isFlagged
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Question text + points */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                            {q.questionText}
                          </h3>
                          <span
                            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                              hasAnswer
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {q.points} PTS
                          </span>
                        </div>

                        {/* Type tag */}
                        <span className="inline-block mb-4 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          {q.questionType?.replace(/_/g, " ")}
                        </span>

                        {/* Answer + status */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div
                            className={`p-4 rounded-xl border ${
                              hasAnswer
                                ? isFlagged
                                  ? "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
                                  : "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30"
                                : "bg-gray-50 dark:bg-black/20 border-black/5 dark:border-white/5"
                            }`}
                          >
                            <p className="text-xs text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                              Your Answer
                            </p>
                            <p
                              className={`flex items-center gap-2 font-medium text-sm ${
                                hasAnswer
                                  ? isFlagged
                                    ? "text-amber-900 dark:text-amber-200"
                                    : "text-purple-900 dark:text-purple-200"
                                  : "text-gray-400 dark:text-gray-500 italic"
                              }`}
                            >
                              {hasAnswer ? (
                                <>
                                  <CheckCircle2
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      isFlagged
                                        ? "text-amber-500"
                                        : "text-purple-500"
                                    }`}
                                  />
                                  {displayAnswer}
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  No answer provided
                                </>
                              )}
                            </p>
                          </div>

                          {/* Status pill */}
                          <div className="flex items-center justify-center">
                            <span
                              className={`px-4 py-2 rounded-xl font-bold text-sm ${
                                !hasAnswer
                                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                  : isFlagged
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                              }`}
                            >
                              {!hasAnswer
                                ? "⬜ Skipped"
                                : isFlagged
                                ? "🚩 Flagged"
                                : "✅ Answered"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Action Buttons ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push(`/student/quizzes/${quizId}/take`)}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
          <button
            onClick={() => router.push("/student/quizzes")}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-lg shadow-purple-500/25"
          >
            <BookOpen className="w-4 h-4" />
            Browse More Quizzes
          </button>
        </motion.div>

      </div>
    </div>
  );
}
