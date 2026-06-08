import React from "react";
import { FolderSearch, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <FolderSearch className="w-16 h-16 text-gray-300 dark:text-gray-600" />, 
  actionText, 
  actionHref,
  actionOnClick 
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-white/[0.02]">
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-800"
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
        {description}
      </p>
      
      {actionText && (actionHref || actionOnClick) && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {actionHref ? (
            <Link 
              href={actionHref}
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-medium hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {actionText}
            </Link>
          ) : (
            <button 
              onClick={actionOnClick}
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-medium hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {actionText}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
