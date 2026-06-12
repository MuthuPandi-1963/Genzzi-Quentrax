// components/admin/QuickActions.tsx — Admin quick action buttons

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Users,
  FileQuestion,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Create Quiz", icon: FileQuestion, desc: "Build interactive quiz", color: "from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)]", href: "/admin/quizzes/new" },
  { label: "New Assessment", icon: ClipboardList, desc: "Set up timed exam", color: "from-[hsl(217,90%,60%)] to-[hsl(263,70%,58%)]", href: "/admin/assessments/new" },
  { label: "Add Question", icon: BookOpen, desc: "Expand question bank", color: "from-[hsl(142,76%,45%)] to-[hsl(190,90%,50%)]", href: "/admin/questions/new" },
  { label: "Invite User", icon: Users, desc: "Send invitation link", color: "from-[hsl(38,92%,55%)] to-[hsl(25,95%,55%)]", href: "/admin/users/invite" },
  { label: "Broadcast", icon: MessageSquare, desc: "Send announcement", color: "from-[hsl(330,80%,60%)] to-[hsl(0,84%,60%)]", href: "/admin/communications" },
  { label: "Analytics", icon: BarChart3, desc: "View detailed reports", color: "from-[hsl(263,70%,58%)] to-[hsl(217,90%,60%)]", href: "/admin/analytics" },
  { label: "Security Audit", icon: Shield, desc: "Review access logs", color: "from-[hsl(0,84%,60%)] to-[hsl(330,80%,60%)]", href: "/admin/audit-logs" },
  { label: "Settings", icon: Settings, desc: "Configure platform", color: "from-[hsl(217,20%,70%)] to-[hsl(260,20%,50%)]", href: "/admin/settings" },
];

export function QuickActions() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
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
            <Zap className="w-5 h-5 text-[hsl(263,70%,58%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              Frequently used operations
            </p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold",
          "bg-[hsl(263,70%,58%)]/15 text-[hsl(263,70%,58%)]"
        )}>
          {actions.length} actions
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-2xl text-left transition-all duration-200 border group",
              isDark
                ? "bg-white/3 border-white/10 hover:bg-white/6 hover:border-white/20"
                : "bg-black/2 border-black/5 hover:bg-black/4 hover:border-black/10"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-xl bg-linear-to-br flex items-center justify-center transition-transform group-hover:scale-110",
              action.color
            )}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{action.label}</p>
              <p className={cn("text-[10px] mt-0.5", isDark ? "text-white/50" : "text-gray-500")}>
                {action.desc}
              </p>
            </div>
            <ChevronRight className={cn(
              "w-3.5 h-3.5 mt-auto ml-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1",
              isDark ? "text-white/30" : "text-gray-400"
            )} />
          </motion.button>
        ))}
      </div>

      {/* Pro tip */}
      <div className={cn(
        "mt-4 p-3 rounded-2xl border",
        isDark
          ? "bg-[hsl(263,70%,58%)]/5 border-[hsl(263,70%,58%)]/20"
          : "bg-[hsl(263,70%,58%)]/5 border-[hsl(263,70%,58%)]/10"
      )}>
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(263,70%,58%)] mt-0.5 shrink-0" />
          <p className={cn("text-xs leading-relaxed", isDark ? "text-white/70" : "text-gray-600")}>
            <span className="font-semibold text-[hsl(263,70%,58%)]">Pro tip:</span> Use keyboard shortcut <kbd className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono", isDark ? "bg-white/10" : "bg-black/10")}>⌘K</kbd> to open the command palette for instant navigation.
          </p>
        </div>
      </div>
    </motion.div>
  );
}