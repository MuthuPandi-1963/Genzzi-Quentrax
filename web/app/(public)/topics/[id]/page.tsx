"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Library } from "lucide-react";
import Link from "next/link";
import QuizCard from "@/components/data-display/QuizCard";
import { useParams } from "next/navigation";

// Mock data
const mockTopic = {
  id: "1",
  name: "React Navigation",
  description: "Learn about routing patterns, dynamic segments, and layout state in modern React applications.",
  difficulty: "medium" as const,
  tags: ["react", "frontend", "routing"],
  category: { name: "Technology" },
  quizzes: [
    { id: "q1", title: "App Router Basics", description: "Test your knowledge on Next.js App Router.", status: "active" as const, timeLimit: 15, totalPoints: 100, _count: { questions: 10 }, creator: { profile: { name: "Sarah", avatar: null } } },
    { id: "q2", title: "Advanced Server Components", description: "Deep dive into RSCs and Suspense.", status: "active" as const, timeLimit: 20, totalPoints: 150, _count: { questions: 15 }, creator: { profile: { name: "Admin", avatar: null } } },
  ],
  sampleQuestions: [
    "What is the primary benefit of React Server Components?",
    "How do you implement nested layouts in the App Router?",
    "Which hook is used to get the current URL pathname in Next.js 13+?"
  ]
};

export default function TopicDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,50%,4%)] text-gray-900 dark:text-gray-100 pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8">
          <Link href="/topics" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Topic Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {mockTopic.category.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                  mockTopic.difficulty === "easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  mockTopic.difficulty === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {mockTopic.difficulty}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-6">{mockTopic.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {mockTopic.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {mockTopic.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quizzes List */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Library className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">Active Quizzes</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {mockTopic.quizzes.map(quiz => (
                  <QuizCard key={quiz.id} quiz={quiz} actionText="Login to Take Quiz" actionHref="/login" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-white/5 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                Sample Questions
              </h3>
              <ul className="space-y-4">
                {mockTopic.sampleQuestions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-bold text-blue-500">{i + 1}.</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Want to see the answers and test your knowledge?</p>
                <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
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
