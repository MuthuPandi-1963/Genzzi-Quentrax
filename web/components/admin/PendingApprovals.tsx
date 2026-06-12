// components/admin/PendingApprovals.tsx — Approval queue for quizzes, users, content

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Clock, CheckCircle2, XCircle, UserPlus, FileQuestion, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalItem {
  id: string;
  type: "user" | "quiz" | "content" | "report";
  title: string;
  subtitle: string;
  requestedBy: string;
  timeAgo: string;
  priority: "low" | "medium" | "high";
}

const mockApprovals: ApprovalItem[] = [
  { id: "1", type: "user", title: "New Teacher Account", subtitle: "john.doe@school.edu", requestedBy: "Registration System", timeAgo: "5m ago", priority: "medium" },
  { id: "2", type: "quiz", title: "Advanced Physics Quiz", subtitle: "15 questions • Hard", requestedBy: "Dr. Sarah Chen", timeAgo: "12m ago", priority: "high" },
  { id: "3", type: "content", title: "Question #4,291", subtitle: "Flagged for review", requestedBy: "Auto-moderator", timeAgo: "28m ago", priority: "low" },
  { id: "4", type: "report", title: "Cheating Report", subtitle: "User #8821 • Quiz #442", requestedBy: "System", timeAgo: "1h ago", priority: "high" },
  { id: "5", type: "quiz", title: "History Final Exam", subtitle: "50 questions • 90 min", requestedBy: "Prof. Marcus J.", timeAgo: "2h ago", priority: "medium" },
];

const approvalConfig = {
  user: { icon: UserPlus, color: "from-[hsl(142,76%,45%)] to-[hsl(190,90%,50%)]" },
  quiz: { icon: FileQuestion, color: "from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)]" },
  content: { icon: FileText, color: "from-[hsl(217,90%,60%)] to-[hsl(263,70%,58%)]" },
  report: { icon: AlertTriangle, color: "from-[hsl(0,84%,60%)] to-[hsl(38,92%,55%)]" },
};

const priorityColors = {
  low: "bg-[hsl(217,90%,60%)]/15 text-[hsl(217,90%,60%)]",
  medium: "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)]",
  high: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]",
};

export function PendingApprovals() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
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
            isDark ? "bg-white/10" : "bg-[hsl(38,92%,55%)]/10"
          )}>
            <Clock className="w-5 h-5 text-[hsl(38,92%,55%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Pending Approvals</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              {mockApprovals.length} items awaiting review
            </p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold",
          "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)]"
        )}>
          {mockApprovals.length} pending
        </span>
      </div>

      <div className="space-y-2">
        {mockApprovals.map((item, i) => {
          const config = approvalConfig[item.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-200 group",
                isDark
                  ? "bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5"
                  : "bg-black/2 border-black/5 hover:border-black/10 hover:bg-black/4"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center shrink-0",
                  config.color
                )}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase",
                      priorityColors[item.priority]
                    )}>
                      {item.priority}
                    </span>
                  </div>
                  <p className={cn("text-xs truncate", isDark ? "text-white/50" : "text-gray-500")}>
                    {item.subtitle}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("text-[10px]", isDark ? "text-white/40" : "text-gray-400")}>
                      by {item.requestedBy}
                    </span>
                    <span className={cn("text-[10px]", isDark ? "text-white/30" : "text-gray-400")}>
                      {item.timeAgo}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isDark
                        ? "bg-[hsl(142,76%,45%)]/10 text-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,45%)]/20"
                        : "bg-[hsl(142,76%,45%)]/10 text-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,45%)]/20"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isDark
                        ? "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/20"
                        : "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/20"
                    )}
                  >
                    <XCircle className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}