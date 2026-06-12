import React from "react";
import { Clock, HelpCircle, User, Play, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { motion } from "framer-motion";
import Link from "next/link";
import { QuizStatus } from "@/@types/enums";

export interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    status: QuizStatus;
    timeLimit: number | null;
    totalPoints: number;
    _count?: { questions: number };
    creator?: { name: string; avatar: string | null };
    topic?: { name: string };
  };
  showStatus?: boolean;
  actionText?: string;
  actionHref?: string;
}

export default function QuizCard({ quiz, showStatus = false, actionText = "Start Quiz", actionHref }: QuizCardProps) {
  const href = actionHref || `/quizzes/${quiz.id}`;
  
  return (
    <motion.div 
      className="cursor-pointer bg-background/70 border border-foreground/10  rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-2">
          {quiz.topic && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-category-sports/30 text-foreground/90">
              {quiz.topic.name}
            </span>
          )}
          {showStatus && <StatusBadge status={quiz.status} />}
        </div>
        
        <h3 className=" text-xl font-bold  mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {quiz.title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1">
          {quiz.description || "No description provided."}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-foreground shadow-sm shadow-border p-4 rounded-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>{quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No limit'}</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>{quiz._count?.questions || 0} Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-[10px] font-bold">P</div>
            <span>{quiz.totalPoints} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            <span className="truncate">{quiz.creator?.name || 'Admin'}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
        <Link href={href} className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors group/btn">
          <span>{actionText}</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
          >
            {actionText === 'Start Quiz' ? <Play className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
