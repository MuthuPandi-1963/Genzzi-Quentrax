"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import TopicCard from "@/components/data-display/TopicCard";
import { useParams } from "next/navigation";

// Mock data
const mockCategory = {
  id: "1",
  name: "Science",
  description: "Physics, Chemistry, Biology and more. Discover the natural world and how it operates through scientific inquiry.",
  topics: [
    { id: "101", name: "Quantum Physics", description: "Subatomic particles, wave-particle duality.", difficulty: "hard" as const, tags: ["physics", "quantum"], _count: { questions: 150, quizzes: 12 } },
    { id: "102", name: "Organic Chemistry", description: "Carbon-based compounds and their reactions.", difficulty: "medium" as const, tags: ["chemistry", "organic"], _count: { questions: 320, quizzes: 25 } },
    { id: "103", name: "Genetics", description: "DNA, RNA, and heredity.", difficulty: "easy" as const, tags: ["biology", "dna"], _count: { questions: 85, quizzes: 8 } },
    { id: "104", name: "Astrophysics", description: "Stars, galaxies, and the universe.", difficulty: "hard" as const, tags: ["space", "stars"], _count: { questions: 210, quizzes: 18 } },
  ]
};

export default function CategoryDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,50%,4%)] text-gray-900 dark:text-gray-100 pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
        </div>

        {/* Category Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{mockCategory.name}</h1>
              <p className="text-purple-600 dark:text-purple-400 font-medium">{mockCategory.topics.length} Topics Available</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl relative z-10">
            {mockCategory.description}
          </p>
        </motion.div>

        {/* Topics Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Topics in {mockCategory.name}</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {mockCategory.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </motion.div>

      </div>
    </div>
  );
}