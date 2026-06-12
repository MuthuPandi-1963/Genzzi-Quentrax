// components/student/CoinsWidget.tsx
// ── Coin wallet + transaction history ──────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Coins, ChevronUp, ChevronDown } from "lucide-react";
import type { CoinsHistoryItem } from "@/@types/student";
import { formatDate, formatCoins } from "@/lib/formatter";
import { cn } from "@/lib/utils";

interface CoinsWidgetProps {
  balance: number;
  history: CoinsHistoryItem[];
}

export function CoinsWidget({ balance, history }: CoinsWidgetProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "rounded-3xl border p-5",
        isDark ? "bg-white/4 border-white/8" : "bg-white/80 border-black/5 shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold">Coin Wallet</h2>
        <Link href="/student/coins" className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">
          History
        </Link>
      </div>

      {/* Balance */}
      <div
        className={cn(
          "rounded-2xl p-4 border mb-4 flex items-center gap-4",
          isDark
            ? "bg-[hsl(45,95%,55%)]/8 border-[hsl(45,95%,55%)]/20"
            : "bg-[hsl(45,95%,55%)]/6 border-[hsl(45,95%,55%)]/15"
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-[hsl(45,95%,55%)]/15 flex items-center justify-center">
          <Coins className="w-6 h-6 text-[hsl(45,95%,55%)]" />
        </div>
        <div>
          <p className="text-2xl font-black text-[hsl(45,95%,55%)]">{formatCoins(balance)}</p>
          <p className={cn("text-xs", isDark ? "text-white/45" : "text-gray-500")}>total balance</p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="space-y-2">
        {history.slice(0, 3).map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black",
                ch.coins > 0
                  ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]"
                  : "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]"
              )}
            >
              {ch.coins > 0 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{ch.reason}</p>
              <p className={cn("text-[10px]", isDark ? "text-white/35" : "text-gray-400")}>
                {formatDate(ch.createdAt)}
              </p>
            </div>
            <span
              className={cn(
                "text-xs font-bold flex-shrink-0",
                ch.coins > 0 ? "text-[hsl(142,76%,45%)]" : "text-[hsl(0,84%,60%)]"
              )}
            >
              {ch.coins > 0 ? "+" : ""}
              {ch.coins}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}