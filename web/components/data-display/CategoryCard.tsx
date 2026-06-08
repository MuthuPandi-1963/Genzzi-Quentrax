import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderTree, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    _count?: { topics: number };
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative block"
    >
      <Link href={`/categories/${category.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {category.name}</span>
      </Link>
      
      <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 relative flex items-center justify-center overflow-hidden">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
        ) : (
          <FolderTree className="w-16 h-16 text-purple-500/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-6 relative -mt-8 bg-white dark:bg-[#0B0A10] rounded-t-3xl pt-8 transition-colors">
        <div className="absolute -top-6 right-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center border border-black/5 dark:border-white/10 z-20 group-hover:bg-purple-600 group-hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {category.name}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
          {category.description || "Explore topics in this category."}
        </p>
        
        <div className="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 w-fit px-3 py-1.5 rounded-full">
          <FolderTree className="w-3.5 h-3.5" />
          {category._count?.topics || 0} Topics
        </div>
      </div>
    </motion.div>
  );
}
