"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Target, Clock, CheckCircle2, XCircle, RotateCcw, Trophy, Brain } from "lucide-react";
import { QuizHistoryAPI } from "@/api/quiz-history";
import { QuizHistory } from "@/@types/QuizHistory";
import { formatDate } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function PublicQuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data: result, isLoading, isError } = useQuery({
    queryKey: ["public-quiz-history", id],
    queryFn: async () => {
      const res = await QuizHistoryAPI.getById(id);
      return (res.data?.data ?? res.data) as QuizHistory;
    },
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-slate-500 font-medium tracking-wide">Loading Certificate...</p>
        </div>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Result Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            This result may have been deleted, or the link is invalid.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const quiz = result.quiz;
  const passingScore = quiz?.passingScore ?? 60;
  const isPassing = result.score >= passingScore;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center transform -rotate-6">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight dark:text-white">Quentrax</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "rounded-[2.5rem] p-8 md:p-14 text-center relative overflow-hidden shadow-2xl",
            isPassing
              ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white"
              : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
          )}
        >
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-xl"
            >
              {isPassing ? (
                <Trophy className="w-14 h-14 text-yellow-300 drop-shadow-lg" />
              ) : (
                <Target className="w-14 h-14 text-white drop-shadow-lg" />
              )}
            </motion.div>

            <h1 className="text-sm font-bold tracking-widest uppercase opacity-80 mb-3">
              Official Assessment Result
            </h1>
            <h2 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-md">
              {quiz?.title || "Assessment Completed"}
            </h2>
            
            <div className="text-lg opacity-90 mb-10 font-medium max-w-lg mx-auto">
              This candidate achieved a score of <strong>{result.score}%</strong> on this official Quentrax assessment.
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center w-full max-w-xl mx-auto bg-black/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10"
            >
              <div className="flex-1 min-w-[120px] p-6 border-r border-white/10">
                <div className="flex items-center justify-center gap-1.5 mb-2 opacity-80">
                  <Award className="w-4 h-4" />
                  <p className="text-xs uppercase tracking-wider font-bold">Final Score</p>
                </div>
                <p className="text-4xl font-black">{result.score}%</p>
              </div>

              <div className="flex-1 min-w-[140px] p-6">
                <div className="flex items-center justify-center gap-1.5 mb-2 opacity-80">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs uppercase tracking-wider font-bold">Completed On</p>
                </div>
                <p className="text-sm font-bold pt-1.5">{formatDate(result.completedAt)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`inline-flex items-center gap-2 mt-10 px-8 py-3 rounded-full font-bold text-sm border border-white/30 backdrop-blur-sm shadow-lg ${
                isPassing ? "bg-white/20" : "bg-black/20"
              }`}
            >
              {isPassing ? (
                <><CheckCircle2 className="w-5 h-5 text-green-300" /> PASSED ASSESSMENT</>
              ) : (
                <><RotateCcw className="w-5 h-5 text-white/80" /> DID NOT PASS</>
              )}
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Want to test your own skills or hire top talent?
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-transform hover:scale-105 shadow-xl"
          >
            Join Quentrax Today
          </Link>
        </div>
      </div>
    </div>
  );
}
