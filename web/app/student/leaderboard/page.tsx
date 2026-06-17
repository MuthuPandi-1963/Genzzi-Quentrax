"use client";

import React, { useMemo } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { UserProfile } from "@/@types/UserProfile";

export default function LeaderboardPage() {
  const { users, isLoading } = useUsers();

  // Sort users by coins descending to create a leaderboard
  const leaderboard = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    // Only include students in the leaderboard
    const students = users.filter((u: any) => u.role === "STUDENT");
    return students.sort((a: any, b: any) => (b.coins || 0) - (a.coins || 0)).slice(0, 50);
  }, [users]);

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            <p className="text-sm text-slate-400">Loading leaderboard...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
            <Trophy className="w-8 h-8 text-amber-500" /> Global Leaderboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            See how you rank against other students based on total coins earned.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm"
        >
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No students found on the leaderboard yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {leaderboard.map((user: any, index: number) => {
                const isTop3 = index < 3;
                
                let RankIcon = null;
                let rankColorClass = "text-slate-500";
                
                if (index === 0) {
                  RankIcon = Trophy;
                  rankColorClass = "text-amber-500";
                } else if (index === 1) {
                  RankIcon = Medal;
                  rankColorClass = "text-slate-400";
                } else if (index === 2) {
                  RankIcon = Medal;
                  rankColorClass = "text-amber-700 dark:text-amber-600";
                }

                return (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] ${isTop3 ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}
                  >
                    <div className={`w-10 text-center font-black text-xl ${rankColorClass}`}>
                      {RankIcon ? <RankIcon className="w-8 h-8 mx-auto" /> : `#${index + 1}`}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border-2 border-transparent">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-slate-500">{user.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          {user.coins || 0}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Coins</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </StudentLayout>
  );
}
