"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, change, positive, icon: Icon, delay = 0 }: StatCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "rounded-3xl p-6 border transition-all duration-300",
        isDark
          ? "bg-white/5 border-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_-4px_rgba(139,92,246,0.15)]"
          : "bg-white/80 border-black/5 shadow-lg hover:shadow-xl hover:border-black/10"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10")}>
          <Icon className="w-5 h-5 text-[hsl(263,70%,58%)]" />
        </div>
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
          positive
            ? isDark ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" : "bg-[hsl(142,76%,45%)]/10 text-[hsl(142,76%,45%)]"
            : isDark ? "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]" : "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)]"
        )}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-black bg-linear-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] bg-clip-text text-transparent">{value}</p>
      <p className={cn("text-sm mt-1", isDark ? "text-white/50" : "text-gray-500")}>{label}</p>
    </motion.div>
  );
}