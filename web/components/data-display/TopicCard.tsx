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

export const diffColors = {
  easy: "bg-green-600   text-background ",
  medium: "bg-orange-500 text-background ",
  hard: "bg-red-700 text-background",
};
export default function TopicCard({ topic }: TopicCardProps) {

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className=" border border-foreground/20 font-bold  rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative flex flex-col h-full"
    >
      <Link href={`/topics/${topic.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {topic.name}</span>
      </Link>

      <div className="flex justify-between items-start mb-4">
        {topic.category && (
          <span className="text-xs font-black uppercase tracking-wider text-category-geography">
            {topic.category.name}
          </span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${diffColors[topic.difficulty]}`}>
          {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
        {topic.name}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1">
        {topic.description || "No description provided."}
      </p>

      {topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {topic.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-foreground-subtle/30 text-foreground/60 rounded-md">
              #{tag}
            </span>
          ))}
          {topic.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-category-geography  rounded-md">
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
