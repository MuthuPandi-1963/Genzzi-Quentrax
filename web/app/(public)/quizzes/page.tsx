"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Flame } from "lucide-react";
import QuizCard, { QuizCardProps } from "@/components/data-display/QuizCard";
import EmptyState from "@/components/feedback/EmptyState";
import { Quiz, Topic } from "@/@types";
import { useQuizzes, useTopics } from "@/hooks";
import { useAuthContext } from "@/context/auth.context";


export default function QuizzesBrowserPage() {
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [quizzes,setQuizzes] = useState<Quiz[]>()
  const {data,isLoading} = useQuizzes()
  const {isAuthenticated} = useAuthContext();
  const {topics} =useTopics()
  const popularTopics =["All",...(topics as unknown as Topic[]).map(topic=>topic.name) as string[]];
  
  useEffect(()=>{
    (async()=>{
      setQuizzes(data as unknown as Quiz[]);
    })()
  },[isLoading])
  const filteredQuizzes =quizzes && quizzes.length > 0 ? quizzes.filter(quiz => {
    if(filterTopic.toLowerCase() == "all"){
      return quizzes;
    }

    const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase()) || (quiz.description?.toLowerCase().includes(search.toLowerCase()));
    const matchesTopic = filterTopic === "all" || quiz?.topic?.name.toLowerCase() === filterTopic.toLowerCase();
    return matchesSearch && matchesTopic;
  }) : [];

  return (
    <div className="min-h-screen bg-background text-foreground/80 pt-24 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Public <span className="text-transparent bg-clip-text  bg-linear-to-r from-emerald-500 to-teal-500">Quizzes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Test your knowledge across thousands of community-created quizzes.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background   border-black border-2
               dark:border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none  shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`px-4 py-2 my-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  (filterTopic === "all" && topic === "All") || filterTopic.toLowerCase() === topic.toLowerCase()
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-100/30 dark:text-emerald-400" 
                    : "bg-transparent text-muted-foreground "
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Highlight Section */}
        <div className="mb-8 flex items-center gap-2 text-xl font-bold">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2>Trending Right Now</h2>
        </div>

        {/* Grid */}
        {filteredQuizzes.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz as unknown as QuizCardProps["quiz"]} actionText={isAuthenticated ? "Start Quiz" :"Login to Take Quiz"} actionHref={`/quizzes/${quiz.id}`} />
            ))}
          </motion.div>
        ) : (
          <EmptyState 
            title="No quizzes found" 
            description="Try adjusting your search terms or filters." 
          />
        )}

      </div>
    </div>
  );
}
