"use client";

import React from "react";
import { Search, Bell, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function AppTopbar() {
  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex-1 flex items-center max-w-md relative">
        <Search className="w-5 h-5 absolute left-3 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search quizzes, topics..." 
          className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:text-white transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6 ml-4">
        <motion.div 
          className="flex items-center gap-2  bg-linear-to-r from-amber-400/20 to-orange-500/20 border border-amber-500/30 px-4 py-1.5 rounded-full cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 rounded-full  bg-linear-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-inner">
            <Coins className="w-3.5 h-3.5 text-amber-900" />
          </div>
          <span className="font-bold text-amber-600 dark:text-amber-400">1,250</span>
        </motion.div>

        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[hsl(260,20%,98%)] dark:border-[hsl(260,30%,6%)] rounded-full"></span>
        </button>

        <div className="w-px h-8 bg-black/10 dark:bg-white/10"></div>

        <button className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">Alex Student</p>
            <p className="text-xs text-gray-500">Level 12</p>
          </div>
          <div className="w-10 h-10 rounded-full  bg-linear-to-tr from-purple-500 to-pink-500 p-[2px]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
          </div>
        </button>
      </div>
    </header>
  );
}
