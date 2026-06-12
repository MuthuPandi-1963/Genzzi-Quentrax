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
      className="rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative block cursor-pointer"
    >
      <Link href={`/categories/${category.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {category.name}</span>
      </Link>
      
      <div className="h-40 bg-category-arts   relative flex items-center justify-center overflow-hidden">
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
        ) : (
          <FolderTree className="w-16 h-16 text-white" />
        )}
        <div className="absolute inset-0  bg-linear-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-6 relative mt-4  rounded-t-3xl pt-8 transition-colors">
        <Link  href={`/categories/${category.id}`} className="absolute -top-6 right-6 w-12 h-12 bg-background-elevated border-category-arts rounded-2xl shadow-lg flex items-center justify-center border-2  z-20 group-hover:bg-category-arts group-hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </Link>
        
        <h3 className="text-xl font-bold  mb-2">
          {category.name}
        </h3>
        
        <p className="text-sm text-foreground/70 line-clamp-2 mb-4 h-10">
          {category.description || "Explore topics in this category."}
        </p>
        
        <div className="flex items-center gap-2 text-xs font-medium text-category-arts  bg-category-arts/5 w-fit px-3 py-1.5 rounded-full">
          <FolderTree className="w-3.5 h-3.5" />
          {category._count?.topics || 0} Topics
        </div>
      </div>
    </motion.div>
  );
}
