/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, HelpCircle, Trophy, User, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data
const mockQuiz = {
  id: "1",
  title: "App Router Fundamentals",
  description: "Test your knowledge of Next.js 13+ App Router. This quiz covers routing, layout patterns, fetching data, and rendering strategies.",
  timeLimit: 15,
  totalPoints: 100,
  _count: { questions: 10 },
  creator: { profile: { name: "Vercel Fan", avatar: null, role: "STAFF" } },
  topic: { name: "React Navigation" },
  tags: ["react", "nextjs", "routing"],
  createdAt: "2023-10-15T10:00:00Z"
};

const mockLeaderboard = [
  { rank: 1, name: "A*** S***", score: 100, time: "8m 12s" },
  { rank: 2, name: "J*** D***", score: 90, time: "9m 45s" },
  { rank: 3, name: "M*** K***", score: 90, time: "11m 02s" },
];

export default function QuizDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen  pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8">
          <Link href="/quizzes" className="inline-flex items-center gap-2 font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-3xl p-8 md:p-12 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-category-geography/10 text-category-geography">
                  {mockQuiz.topic.name}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-6">{mockQuiz.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {mockQuiz.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-black/5 dark:border-white/10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500" /> Time Limit
                  </div>
                  <span className="font-bold text-lg">{mockQuiz.timeLimit ? `${mockQuiz.timeLimit} mins` : "None"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <HelpCircle className="w-4 h-4 text-blue-500" /> Questions
                  </div>
                  <span className="font-bold text-lg">{mockQuiz._count.questions}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Trophy className="w-4 h-4 text-amber-500" /> Total Points
                  </div>
                  <span className="font-bold text-lg">{mockQuiz.totalPoints}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-emerald-500" /> Created
                  </div>
                  <span className="font-bold text-lg">{new Date(mockQuiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full  bg-linear-to-tr from-emerald-500 to-teal-500 p-0.5">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mockQuiz.creator.profile.name}`} alt="Avatar" className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      {mockQuiz.creator.profile.name}
                      {mockQuiz.creator.profile.role === "STAFF" && <Shield className="w-3 h-3 text-blue-500" />}
                    </p>
                    <p className="text-xs text-gray-500">Creator</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {mockQuiz.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar CTA & Leaderboard */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-category-sports rounded-3xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
              <p className=" mb-6 text-sm">You must be logged in to take this quiz and record your score.</p>
              
              <Link href="/login" className="block w-full py-4 bg-white text-emerald-900 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Login to Take Quiz
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Performers
              </h3>
              
              <div className="space-y-3">
                {mockLeaderboard.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3 rounded bg-foreground/10">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                        i === 0 ? "bg-orange-300 " :
                        i === 1 ? "bg-category-science" :
                        i === 2 ? "bg-orange-100 text-orange-800" : "bg-transparent text-gray-500"
                      }`}>
                        {entry.rank}
                      </span>
                      <span className="font-medium text-sm">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-category-sports">{entry.score} pts</div>
                      <div className="text-xs text-gray-500">{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">Login to see full leaderboard</p>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
