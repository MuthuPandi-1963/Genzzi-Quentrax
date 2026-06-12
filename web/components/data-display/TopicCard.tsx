import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Library, ArrowRight, ImageOff } from "lucide-react";
import { Difficulty } from "@/@types/enums";

// ─────────────────────────────────────────────────────────────────────────────

interface TopicCardProps {
  topic: {
    id: string;
    name: string;
    description: string | null;
    difficulty: Difficulty;
    tags: string[];
    _count?: { questions: number; quizzes: number };
    category?: { name: string };
    imageUrl: string | null;
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export const diffColors = {
  EASY:   "bg-green-600  text-background",
  MEDIUM: "bg-orange-500 text-background",
  HARD:   "bg-red-700    text-background",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group bg-background/80 border border-foreground/20 font-bold rounded-2xl shadow-sm hover:shadow-lg transition-all relative flex flex-col sm:flex-row overflow-hidden h-full sm:h-56"
    >
      {/* ── Left: Image ── */}
      <div className="relative w-full sm:w-48 lg:w-64 shrink-0 overflow-hidden bg-background">
        {topic.imageUrl ? (
          <img
            src={topic.imageUrl}
            alt={topic.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        
        {/* Difficulty badge overlay */}
        <span
          className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-md font-bold ${diffColors[topic.difficulty]}`}
        >
          {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
        </span>
      </div>

      {/* ── Right: Content ── */}
      <div className="flex-1 flex flex-col p-5 relative">
        <Link href={`/topics/${topic.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {topic.name}</span>
        </Link>

        {/* Category */}
        {topic.category && (
          <span className="text-xs font-black uppercase tracking-wider text-category-geography mb-2">
            {topic.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {topic.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
          {topic.description || "No description provided."}
        </p>

        {/* Tags */}
        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {topic.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-foreground-subtle/30 text-foreground/60 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {topic.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-category-geography rounded-md">
                +{topic.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10 mt-auto">
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
      </div>
    </motion.div>
  );
}