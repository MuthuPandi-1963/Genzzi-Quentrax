"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Play } from "lucide-react";
import QuizCard from "@/components/data-display/QuizCard";
import StatusBadge from "@/components/data-display/StatusBadge";

// Mock Data
const mockQuizzes = [
  { id: "1", title: "App Router Fundamentals", description: "Test your knowledge of Next.js 13+ App Router.", status: "active" as const, timeLimit: 15, totalPoints: 100, _count: { questions: 10 }, topic: { name: "React Navigation" } },
  { id: "2", title: "Python Data Types", description: "Lists, Dicts, Sets, and Tuples.", status: "active" as const, timeLimit: 10, totalPoints: 50, _count: { questions: 5 }, topic: { name: "Python Basics" } },
];

const mockHistory = [
  { id: "h1", title: "Quantum Physics 101", score: 180, totalPoints: 200, percentage: 90, completedAt: "2023-10-20T14:30:00Z" },
  { id: "h2", title: "React Navigation", score: 85, totalPoints: 100, percentage: 85, completedAt: "2023-10-18T09:15:00Z" },
  { id: "h3", title: "Calculus I Limits", score: 120, totalPoints: 300, percentage: 40, completedAt: "2023-10-10T16:45:00Z" },
];

export default function MyQuizzesPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "history">("browse");

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">My Quizzes</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover new quizzes or review your past performances.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "browse" 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Browse Active
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "history" 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            My History
          </button>
        </div>
      </div>

      {activeTab === "browse" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search active quizzes..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} actionText="Take Quiz" actionHref={`/quizzes/${quiz.id}/take`} />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "history" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 border-b border-black/5 dark:border-white/10">
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Quiz Title</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Score</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date Completed</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {mockHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{history.title}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{history.score}/{history.totalPoints}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            history.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' :
                            history.percentage >= 50 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {history.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={history.percentage >= 50 ? "COMPLETED" : "FAILED"} />
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(history.completedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
