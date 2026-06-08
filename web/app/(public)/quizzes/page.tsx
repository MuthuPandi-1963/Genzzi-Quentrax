"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Flame } from "lucide-react";
import QuizCard from "@/components/data-display/QuizCard";
import EmptyState from "@/components/feedback/EmptyState";

// Mock data
const mockQuizzes = [
  { id: "1", title: "App Router Fundamentals", description: "Test your knowledge of Next.js 13+ App Router.", status: "active" as const, timeLimit: 15, totalPoints: 100, _count: { questions: 10 }, creator: { profile: { name: "Vercel Fan", avatar: null } }, topic: { name: "React Navigation" } },
  { id: "2", title: "Quantum Physics 101", description: "Basic concepts of quantum mechanics.", status: "active" as const, timeLimit: 30, totalPoints: 200, _count: { questions: 20 }, creator: { profile: { name: "Dr. Science", avatar: null } }, topic: { name: "Quantum Mechanics" } },
  { id: "3", title: "WWII European Theater", description: "Battles and events in Europe during WWII.", status: "active" as const, timeLimit: null, totalPoints: 150, _count: { questions: 15 }, creator: { profile: { name: "History Buff", avatar: null } }, topic: { name: "World War II" } },
  { id: "4", title: "Python Data Types", description: "Lists, Dicts, Sets, and Tuples.", status: "active" as const, timeLimit: 10, totalPoints: 50, _count: { questions: 5 }, creator: { profile: { name: "PyCoder", avatar: null } }, topic: { name: "Python Basics" } },
  { id: "5", title: "Derivatives & Limits", description: "Calculus I mid-term practice.", status: "active" as const, timeLimit: 45, totalPoints: 300, _count: { questions: 25 }, creator: { profile: { name: "Math Wizard", avatar: null } }, topic: { name: "Calculus I" } },
];

export default function QuizzesBrowserPage() {
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState<string>("all");

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase()) || (quiz.description?.toLowerCase().includes(search.toLowerCase()));
    const matchesTopic = filterTopic === "all" || quiz.topic.name.toLowerCase() === filterTopic.toLowerCase();
    return matchesSearch && matchesTopic;
  });

  const popularTopics = ["All", "React Navigation", "Quantum Mechanics", "World War II", "Python Basics"];

  return (
    <div className="min-h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,50%,4%)] text-gray-900 dark:text-gray-100 pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Public <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Quizzes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Test your knowledge across thousands of community-created quizzes.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none text-gray-900 dark:text-white shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`px-4 py-2 my-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  (filterTopic === "all" && topic === "All") || filterTopic.toLowerCase() === topic.toLowerCase()
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Highlight Section */}
        <div className="mb-8 flex items-center gap-2 text-xl font-bold">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2>Trending Right Now</h2>
        </div>

        {/* Grid */}
        {filteredQuizzes.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} actionText="Login to Take Quiz" actionHref={`/quizzes/${quiz.id}`} />
            ))}
          </motion.div>
        ) : (
          <EmptyState 
            title="No quizzes found" 
            description="Try adjusting your search terms or filters." 
          />
        )}

      </div>
    </div>
  );
}
