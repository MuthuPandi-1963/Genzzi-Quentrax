"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Library } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import QuizCard, { QuizCardProps } from "@/components/data-display/QuizCard";
import { diffColors } from "@/components/data-display/TopicCard";
import { useTopicById } from "@/hooks/useTopics";
import { Question, Quiz } from "@/@types";
import { useAuthContext } from "@/context/auth.context";
export interface TopicDetailResponse {
  id: string;
  name: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  category: {
    id: string;
    name: string;
  };
  quizzes: Quiz[];
  sampleQuestions: string[];
}
export default function TopicDetailPage() {
  const params = useParams();
  const {isAuthenticated} = useAuthContext()
  const [ topic,setTopic ] =useState<TopicDetailResponse>();

  const topicId = params.id as string;
  
  const {
    data,
    isLoading,
    isError,
  } = useTopicById(topicId);

  useEffect(()=>{
    (async()=>{
      setTopic(data?.data);
    })()
  },[isLoading,data])
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Loading topic...
        </p>
      </div>
    );
  }
  console.log(topic);
  

  if (isError || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          Topic not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-[96%] w-[90%] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/categories/${topic.category.id}`}
            className="inline-flex items-center gap-2 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {topic.category.name}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Topic Header */}
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
                  {topic.category.name}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />

                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                    topic.difficulty === "easy"
                      ? diffColors.EASY
                      : topic.difficulty === "medium"
                      ? diffColors.MEDIUM
                      : diffColors.HARD
                  }`}
                >
                  {topic.difficulty}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-6">
                {topic.name}
              </h1>

              {topic.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  {topic.description}
                </p>
              )}

              {topic.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="
                        px-3 py-1 rounded-lg text-sm font-medium
                        text-foreground-muted/80
                      "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quizzes */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Library className="w-6 h-6 text-blue-500" />

                <h2 className="text-2xl font-bold">
                  Active Quizzes
                </h2>
              </div>

              {topic.quizzes?.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {topic.quizzes.map((quiz: Quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz as unknown as QuizCardProps["quiz"]}
                      actionText={isAuthenticated ? "Start Quiz" : "Login to Take Quiz"}
                      actionHref={isAuthenticated ? `/quizzes/${quiz.id}` : "/login"}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    No quizzes available yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="shadow-foreground/20 shadow-lg rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold mb-4">
                Sample Questions
              </h3>

              {topic?.quizzes[0]?.questions?.length > 0 ? (
                <ul className="space-y-4">
                  {topic.quizzes[0].questions.map(
                    (question: Question, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="font-bold">
                          {index + 1}.
                        </span>

                        <span className="text-foreground/60 font-medium text-sm leading-relaxed">
                          {question.questionText}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sample questions available.
                </p>
              )}

              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to test your knowledge?
                </p>

                <Link
                  href={isAuthenticated ? "/student/quizzes/${quizzId}/take" : "/login"}
                  className="
                    flex items-center justify-center gap-2
                    w-full py-3 bg-blue-600 hover:bg-blue-700
                    text-white rounded-xl font-bold transition-colors
                  "
                >
                  <Play className="w-4 h-4" />
                  Start Practicing
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}