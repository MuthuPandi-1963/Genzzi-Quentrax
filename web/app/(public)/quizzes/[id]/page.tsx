/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Library, Clock, HelpCircle, Trophy, Calendar, Shield, Star, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { diffColors } from "@/components/data-display/TopicCard";
import { useQuizById } from "@/hooks/useQuizzes";
import { useQuizLeaderboard } from "@/hooks/useQuizzes";
import { useAuthContext } from "@/context/auth.context";

// ─────────────────────────────────────────────────────────────────────────────

interface QuizDetailResponse {
  id: string;
  title: string;
  description: string | null;
  status: string;
  tags: string[];
  timeLimit: number | null;
  totalPoints: number;
  imageUrl: string | null;
  topic: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    } | null;
  } | null;
  creator: {
    id: string;
    name: string | null;
    avatar: string | null;
    role: string | null;
  } | null;
  questions: {
    id: string;
    questionText: string;
    difficulty: string;
    points: number;
  }[];
  createdAt: string;
  _count?: {
    questions: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function QuizDetailPage() {
  const params = useParams();
  const {isAuthenticated} = useAuthContext()
  const quizId = params.id as string;

  const {
    data: quizData,
    isLoading,
    isError,
  } = useQuizById(quizId);

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
  } = useQuizLeaderboard(quizId, { limit: 10 });

  console.log((quizData));
  
  const [quiz, setQuiz] = useState<QuizDetailResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{
    rank: number;
    userName: string;
    score: number;
    time?: string;
  }> | null>(null);

  useEffect(() => {
    (async()=>{
      if (quizData) {
      setQuiz(quizData as unknown as QuizDetailResponse);
    }
    })()
  }, [quizData]);

  useEffect(() => {
    (async()=>{
      if (leaderboardData) {
      setLeaderboard(leaderboardData as unknown as typeof leaderboard);
    }
    })()
  }, [leaderboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-[96%] w-[90%] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={quiz.topic ? `/topics/${quiz.topic.id}` : "/quizzes"}
            className="inline-flex items-center gap-2 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {quiz.topic?.name ?? "Quizzes"}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quiz Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                bg-white dark:bg-white/5
                border border-black/5 dark:border-white/10
                rounded-3xl p-8 shadow-sm
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold uppercase tracking-wider">
                  {quiz.topic?.name ?? "Quiz"}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />

                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                    quiz.status === "ACTIVE"
                      ? "bg-category-sports"
                      
                      : "bg-timer-critical"
                  }`}
                >
                  {quiz.status}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-6">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  {quiz.description}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-black/5 dark:border-white/10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500" /> Time Limit
                  </div>
                  <span className="font-bold text-lg">
                    {quiz.timeLimit ? `${quiz.timeLimit} mins` : "None"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <HelpCircle className="w-4 h-4 text-blue-500" /> Questions
                  </div>
                  <span className="font-bold text-lg">
                    {quiz.questions?.length ?? 0}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Trophy className="w-4 h-4 text-amber-500" /> Total Points
                  </div>
                  <span className="font-bold text-lg">{quiz.totalPoints}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-emerald-500" /> Created
                  </div>
                  <span className="font-bold text-lg">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Creator + Tags */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 p-0.5">
                    <img
                      src={
                        quiz.creator?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${quiz.creator?.name || "xyz"}`
                      }
                      alt="Avatar"
                      className="w-full h-full rounded-full bg-white dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      {quiz.creator?.name ?? "Unknown"}
                      {quiz.creator?.role === "STAFF" && (
                        <Shield className="w-3 h-3 text-blue-500" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Creator</p>
                  </div>
                </div>

                {quiz.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {quiz.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg text-sm font-medium text-foreground-muted/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Questions Preview */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Library className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Questions</h2>
              </div>

              {quiz.questions?.length > 0 ? (
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="
                        bg-white dark:bg-white/5
                        border border-black/5 dark:border-white/10
                        rounded-2xl p-6 shadow-sm
                      "
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-bold text-lg text-purple-500 shrink-0">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-foreground font-medium leading-relaxed">
                            {question.questionText}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                question.difficulty === "EASY"
                                  ? diffColors.EASY
                                  : question.difficulty === "MEDIUM"
                                  ? diffColors.MEDIUM
                                  : diffColors.HARD
                              }`}
                            >
                              {question.difficulty}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-foreground-muted">
                              <Star className="w-3 h-3 text-amber-500" />
                              {question.points} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    No questions in this quiz yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Start Quiz CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="shadow-foreground/20 shadow-lg rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You must be logged in to take this quiz and record your score.
              </p>

              <Link
                href={isAuthenticated ? `/student/quizzes/${quiz.id}/take` : "/login"}
                className="
                  flex items-center justify-center gap-2
                  w-full py-3 bg-blue-600 hover:bg-blue-700
                  text-white rounded-xl font-bold transition-colors
                "
              >
                <Play className="w-4 h-4" />
                {isAuthenticated ? "Start Quiz" : "Login to Take Quiz"}
              </Link>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="
                bg-white dark:bg-white/5
                border border-black/5 dark:border-white/10
                rounded-3xl p-6 shadow-sm
              "
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Performers
              </h3>

              {leaderboardLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-foreground/5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                            i === 0
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : i === 1
                              ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              : i === 2
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-transparent text-gray-500"
                          }`}
                        >
                          {entry.rank}
                        </span>
                        <span className="font-medium text-sm">{entry.userName}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-blue-600 dark:text-blue-400">
                          {entry.score} pts
                        </div>
                        {entry.time && (
                          <div className="text-xs text-gray-500">{entry.time}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No attempts yet. Be the first!
                </p>
              )}

              <p className="text-center text-xs text-gray-500 mt-4">
                Login to see full leaderboard
              </p>
            </motion.div>

            {/* Related Quizzes (if topic exists) */}
            {quiz.topic && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="
                  bg-white dark:bg-white/5
                  border border-black/5 dark:border-white/10
                  rounded-3xl p-6 shadow-sm
                "
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" />
                  More from {quiz.topic.name}
                </h3>
                <Link
                  href={`/topics/${quiz.topic.id}`}
                  className="
                    flex items-center justify-center gap-2
                    w-full py-3 border border-black/10 dark:border-white/10
                    hover:bg-foreground/5 rounded-xl font-medium transition-colors
                  "
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse Topic
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}