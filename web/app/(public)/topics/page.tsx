"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import TopicCard from "@/components/data-display/TopicCard";
import EmptyState from "@/components/feedback/EmptyState";

// Mock data
const mockTopics = [
  { id: "1", name: "Quantum Mechanics", description: "Deep dive into subatomic phenomena.", difficulty: "hard" as const, tags: ["physics", "quantum"], category: { name: "Science" }, _count: { questions: 120, quizzes: 8 } },
  { id: "2", name: "React Navigation", description: "Routing patterns in modern React apps.", difficulty: "medium" as const, tags: ["react", "frontend"], category: { name: "Technology" }, _count: { questions: 50, quizzes: 4 } },
  { id: "3", name: "World War II", description: "Key events and battles of WWII.", difficulty: "easy" as const, tags: ["history", "war"], category: { name: "History" }, _count: { questions: 200, quizzes: 15 } },
  { id: "4", name: "Python Basics", description: "Introduction to Python programming.", difficulty: "easy" as const, tags: ["python", "coding"], category: { name: "Technology" }, _count: { questions: 350, quizzes: 30 } },
  { id: "5", name: "Calculus I", description: "Limits, derivatives, and integrals.", difficulty: "hard" as const, tags: ["math", "calculus"], category: { name: "Mathematics" }, _count: { questions: 180, quizzes: 10 } },
  { id: "6", name: "European Capitals", description: "Memorize the capitals of European nations.", difficulty: "medium" as const, tags: ["geography", "europe"], category: { name: "Geography" }, _count: { questions: 80, quizzes: 5 } },
];

export default function TopicsBrowserPage() {
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredTopics = mockTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase()) || topic.tags.some(t => t.includes(search.toLowerCase()));
    const matchesDiff = filterDifficulty === "all" || topic.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

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
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Topics</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Find specific areas of study to focus your learning. Filter by difficulty or search by tags.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12 p-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl shadow-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search topics by name or tag..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-transparent focus:ring-0 outline-none text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="w-px bg-black/10 dark:bg-white/10 hidden md:block" />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                  filterDifficulty === diff 
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {filteredTopics.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </motion.div>
        ) : (
          <EmptyState 
            title="No topics found" 
            description="Try adjusting your search terms or filters." 
          />
        )}

      </div>
    </div>
  );
}