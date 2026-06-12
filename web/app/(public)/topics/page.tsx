"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import TopicCard from "@/components/data-display/TopicCard";
import EmptyState from "@/components/feedback/EmptyState";
import { useTheme } from "next-themes";
import { useTopics } from "@/hooks";
import { Topic } from "@/@types";


export default function TopicsBrowserPage() {
  const {resolvedTheme} = useTheme()
  const {topics:data,isLoading} = useTopics()
  const [topics,setTopics] = useState<Topic[]>();
  const [search, setSearch] = useState("");
  useEffect(()=>{
    (async()=>{
      setTopics(data);
    })()
  },[isLoading])
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredTopics =topics && topics?.length  > 0 ? topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase()) || topic.tags.some(t => t.includes(search.toLowerCase()));
    const matchesDiff = filterDifficulty === "all" || topic.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  }) : [];

  return (
    <div className={`min-h-screen bg-transparent pt-24 pb-20 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Explore <span className="text-transparent bg-clip-text  bg-linear-to-r from-blue-600 to-cyan-500">Topics</span>
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
          className="flex flex-col md:flex-row gap-4 mb-12 p-4 rounded-sm shadow-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search topics by name or tag..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl  focus:ring-0 outline-none"
            />
          </div>
          
          <div className="w-px hidden md:block" />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors cursor-pointer ${
                  filterDifficulty === diff 
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                    : " text-foreground-muted/80    hover:text-foreground"
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
            className="grid  md:grid-cols-1  xl:grid-cols-2 gap-6"
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