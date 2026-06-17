// components/student/AssignmentsList.tsx
// ── Upcoming assignments with real data ────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Clock, CheckCircle2, PlayCircle, Circle, ChevronRight } from "lucide-react";
import type { AssignmentItem } from "@/@types/student";
import { formatDate, daysUntil } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface AssignmentsListProps {
  assignments: AssignmentItem[];
}

const statusConfig = {
  PENDING: {
    text: "text-[hsl(45,95%,55%)]",
    bg: "bg-[hsl(45,95%,55%)]/12",
    label: "Pending",
    icon: Circle,
  },
  IN_PROGRESS: {
    text: "text-[hsl(263,70%,58%)]",
    bg: "bg-[hsl(263,70%,58%)]/12",
    label: "In Progress",
    icon: PlayCircle,
  },
  COMPLETED: {
    text: "text-[hsl(142,76%,45%)]",
    bg: "bg-[hsl(142,76%,45%)]/12",
    label: "Completed",
    icon: CheckCircle2,
  },
  EXEMPTED: {
    text: "text-white/40",
    bg: "bg-white/8",
    label: "Exempted",
    icon: Circle,
  },
};

export function AssignmentsList({ assignments }: AssignmentsListProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pendingCount = assignments.filter((a) => a.status === "PENDING").length;
  const inProgressCount = assignments.filter((a) => a.status === "IN_PROGRESS").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={cn(
        "rounded-3xl border lg:col-span-2 p-5",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold">Upcoming Assessments</h2>
          <p className={cn("text-xs mt-0.5", isDark ? "text-white/45" : "text-gray-500")}>
            {pendingCount} pending · {inProgressCount} in progress
          </p>
        </div>
        <Link
          href="/student/assessments"
          className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {assignments.map((a, i) => {
          const s = statusConfig[a.status];
          const days = daysUntil(a.dueDate);
          const StatusIcon = s.icon;

          const getHref = (status: string, id: string) => {
            if (status === "COMPLETED") return `/student/results/${id}`;
            if (status === "PENDING" || status === "IN_PROGRESS") return `/student/assessments/${id}/take`;
            return "#";
          };

          return (
            <Link key={a.id} href={getHref(a.status, a.id)} className="block focus:outline-none">
              <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group cursor-pointer",
                isDark
                  ? "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/14"
                  : "bg-black/2 border-black/6 hover:bg-black/4 hover:border-black/10"
              )}
            >
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0", s.bg)}>
                <StatusIcon className={cn("w-5 h-5", s.text)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold truncate">{a.title}</p>
                  <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold", s.bg, s.text)}>
                    {s.label}
                  </span>
                </div>
                <div className={cn("flex items-center gap-3 mt-1 text-xs", isDark ? "text-white/45" : "text-gray-500")}>
                  <span>{a.topicName}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {a.timeLimit}m
                  </span>
                  <span>·</span>
                  <span>{a.totalQuestions} questions</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                {a.status === "COMPLETED" && a.score !== undefined ? (
                  <div>
                    <p
                      className={cn(
                        "text-sm font-black",
                        a.score >= a.passingScore ? "text-[hsl(142,76%,45%)]" : "text-[hsl(0,84%,60%)]"
                      )}
                    >
                      {a.score}%
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>score</p>
                  </div>
                ) : (
                  <div>
                    <p
                      className={cn(
                        "text-xs font-bold",
                        days <= 2 ? "text-[hsl(0,84%,60%)]" : days <= 5 ? "text-[hsl(45,95%,55%)]" : isDark ? "text-white/60" : "text-gray-500"
                      )}
                    >
                      {days <= 0 ? "Overdue" : `${days}d left`}
                    </p>
                    <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>
                      {formatDate(a.dueDate)}
                    </p>
                  </div>
                )}
              </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}