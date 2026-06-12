// components/student/StreakCard.tsx
// ── Daily streak tracker ───────────────────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className={cn(
        "rounded-3xl border p-5 relative overflow-hidden",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[hsl(25,95%,55%)]/12 blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-[hsl(25,95%,55%)]/15 flex items-center justify-center">
            <Flame className="w-5 h-5 text-[hsl(25,95%,55%)]" />
          </div>
          <div>
            <p className="text-2xl font-black text-[hsl(25,95%,55%)]">{streak}</p>
            <p className={cn("text-xs", isDark ? "text-white/45" : "text-gray-500")}>day streak</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                i < streak ? "bg-[hsl(25,95%,55%)]" : isDark ? "bg-white/10" : "bg-black/8"
              )}
            />
          ))}
        </div>
        <p className={cn("text-xs mt-2", isDark ? "text-white/40" : "text-gray-400")}>
          Quiz daily to extend your streak
        </p>
      </div>
    </motion.div>
  );
}