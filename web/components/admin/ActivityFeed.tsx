// components/admin/ActivityFeed.tsx — Real-time activity stream

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Activity, CheckCircle2, FileQuestion, UserPlus, ShieldAlert, FileText } from "lucide-react";
import { useActivity } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

const activityIcons = {
  quiz: FileQuestion,
  user: UserPlus,
  system: FileText,
  security: ShieldAlert,
};

const activityColors = {
  quiz: "bg-[hsl(263,70%,58%)]/15 text-[hsl(263,70%,58%)]",
  user: "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]",
  system: "bg-[hsl(217,90%,60%)]/15 text-[hsl(217,90%,60%)]",
  security: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]",
};

export function ActivityFeed() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: activities, isLoading } = useActivity();

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-3xl border p-6 animate-pulse",
        isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="h-6 w-32 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "rounded-3xl border p-6",
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-black/5 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
          )}>
            <Activity className="w-5 h-5 text-[hsl(263,70%,58%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Activity Feed</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              Live system events
            </p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold",
          "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]"
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142,76%,45%)] animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="space-y-1">
        {activities?.map((item, i) => {
          const Icon = activityIcons[item.type] || Activity;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-2xl transition-colors group cursor-pointer",
                isDark ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                activityColors[item.type]
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  <span className={isDark ? "text-white" : "text-gray-900"}>{item.user}</span>
                  {" "}
                  <span className={isDark ? "text-white/60" : "text-gray-500"}>{item.action}</span>
                  {" "}
                  <span className="text-[hsl(263,70%,58%)]">{item.target}</span>
                </p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
                  {item.timestamp}
                </p>
              </div>
              {item.score && (
                <span className={cn(
                  "px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
                  isDark ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" : "bg-[hsl(142,76%,45%)]/10 text-[hsl(142,76%,45%)]"
                )}>
                  <CheckCircle2 className="w-3 h-3" />
                  {item.score}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}