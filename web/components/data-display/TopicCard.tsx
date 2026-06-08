import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Library, ArrowRight } from "lucide-react";

interface TopicCardProps {
  topic: {
    id: string;
    name: string;
    description: string | null;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    _count?: { questions: number; quizzes: number };
    category?: { name: string };
  };
}

export default function TopicCard({ topic }: TopicCardProps) {
  const diffColors = {
    easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative flex flex-col h-full"
    >
      <Link href={`/topics/${topic.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {topic.name}</span>
      </Link>

      <div className="flex justify-between items-start mb-4">
        {topic.category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {topic.category.name}
          </span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${diffColors[topic.difficulty]}`}>
          {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
        {topic.name}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1">
        {topic.description || "No description provided."}
      </p>

      {topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {topic.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-md">
              #{tag}
            </span>
          ))}
          {topic.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-md">
              +{topic.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10 mt-auto">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Library className="w-3.5 h-3.5" />
            <span>{topic._count?.quizzes || 0} Quizzes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{topic._count?.questions || 0} Qs</span>
          </div>
        </div>
        
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
      </div>
    </motion.div>
  );
}
