"use client";

import React from "react";
import { useStudentStats } from "@/hooks/useStudent";
import { StudentLayout } from "@/components/student/StudentLayout";
import { motion } from "framer-motion";
import { User, Mail, Award, Flame, Shield } from "lucide-react";
import StatusBadge from "@/components/data-display/StatusBadge";

export default function StudentProfilePage() {
  const { stats, isLoading } = useStudentStats();

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading profile...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (!stats) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-slate-500">Could not load profile data.</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your personal information and track your overall progress.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden shrink-0">
              {stats.avatar ? (
                <img src={stats.avatar} alt={stats.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-violet-500" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stats.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">@{stats.username}</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <StatusBadge status={stats.role} size="sm" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200 text-sm truncate">{stats.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Coins</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200 text-sm">{stats.coins}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Current Streak</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200 text-sm">{stats.streak} Days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Account Status</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200 text-sm">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
