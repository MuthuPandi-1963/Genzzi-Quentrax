"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import CategoryCard from "@/components/data-display/CategoryCard";
import EmptyState from "@/components/feedback/EmptyState";

const mockCategories = [
  { id: "1", name: "Science", description: "Physics, Chemistry, Biology and more.", imageUrl: null, _count: { topics: 42 } },
  { id: "2", name: "Technology", description: "Programming, AI, and Gadgets.", imageUrl: null, _count: { topics: 38 } },
  { id: "3", name: "History", description: "World history, ancient civilizations.", imageUrl: null, _count: { topics: 24 } },
  { id: "4", name: "Geography", description: "Countries, capitals, and maps.", imageUrl: null, _count: { topics: 18 } },
  { id: "5", name: "Mathematics", description: "Algebra, Geometry, Calculus.", imageUrl: null, _count: { topics: 29 } },
  { id: "6", name: "Literature", description: "Books, authors, and poetry.", imageUrl: null, _count: { topics: 15 } },
];

export default function CategoriesBrowserPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = mockCategories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-foreground pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"
          />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Browse{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">
              Categories
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"  
          >
            Explore a wide range of subjects. From hard sciences to creative arts, find the perfect topic to challenge yourself.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> {/* ✅ was text-gray-400 */}
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-lg shadow-sm placeholder:text-muted-foreground" 
            />
          </div>
        </motion.div>

        {/* Grid */}
        {filteredCategories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No categories found"
            description={`We couldn't find any categories matching "${search}".`}
          />
        )}

      </div>
    </div>
  );
}