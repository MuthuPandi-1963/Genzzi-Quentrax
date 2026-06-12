"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Users, BookOpen, ClipboardList, Coins, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", positive: true, icon: Users },
  { label: "Active Quizzes", value: "1,234", change: "+5%", positive: true, icon: BookOpen },
  { label: "Assessments", value: "89", change: "-2%", positive: false, icon: ClipboardList },
  { label: "Coins Distributed", value: "2.4M", change: "+18%", positive: true, icon: Coins },
];

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">
            <span className="bg-linear-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className={cn("text-sm mt-1", isDark ? "text-white/50" : "text-gray-500")}>
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5",
            isDark ? "bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/30 text-[hsl(142,76%,45%)]" : "bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)]"
          )}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[hsl(142,76%,45%)] animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={cn(
                "rounded-3xl p-6 border transition-all duration-300",
                isDark ? "bg-white/5 border-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_-4px_rgba(139,92,246,0.15)]" : "bg-white/80 border-black/5 shadow-lg hover:shadow-xl hover:border-black/10"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10")}>
                  <Icon className="w-5 h-5 text-[hsl(263,70%,58%)]" />
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
                  stat.positive
                    ? isDark ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" : "bg-[hsl(142,76%,45%)]/10 text-[hsl(142,76%,45%)]"
                    : isDark ? "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]" : "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)]"
                )}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black bg-linear-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] bg-clip-text text-transparent">{stat.value}</p>
              <p className={cn("text-sm mt-1", isDark ? "text-white/50" : "text-gray-500")}>{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}