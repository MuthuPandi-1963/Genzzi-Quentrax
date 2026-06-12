// components/admin/CoinsWidget.tsx — Coin economy dashboard widget

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Gift,
  MinusCircle,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTransactions } from "@/hooks/useAdmin";
import { formatNumber } from "@/lib/adminFormatters";
import { cn } from "@/lib/utils";

const typeConfig = {
  earned: { icon: PlusCircle, color: "text-[hsl(142,76%,45%)]", bg: "bg-[hsl(142,76%,45%)]/15", label: "Earned" },
  spent: { icon: MinusCircle, color: "text-[hsl(0,84%,60%)]", bg: "bg-[hsl(0,84%,60%)]/15", label: "Spent" },
  bonus: { icon: Gift, color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/15", label: "Bonus" },
  penalty: { icon: MinusCircle, color: "text-[hsl(38,92%,55%)]", bg: "bg-[hsl(38,92%,55%)]/15", label: "Penalty" },
};

export function CoinsWidget() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: transactions, isLoading } = useTransactions({ limit: 20 });
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);

  const filteredTxs = transactions?.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  const totalIn = transactions?.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0) || 0;
  const totalOut = transactions?.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0) || 0;
  const netFlow = totalIn - totalOut;
  const totalDistributed = 2400000; // From stats

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
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
          )}>
            <Coins className="w-5 h-5 text-[hsl(263,70%,58%)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Coin Economy</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              Transaction flow & balance
            </p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold",
          netFlow >= 0 ? "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" : "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)]"
        )}>
          {netFlow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {netFlow >= 0 ? "+" : ""}{formatNumber(netFlow)} net
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className={cn(
          "p-3 rounded-2xl border text-center",
          isDark ? "bg-white/3 border-white/10" : "bg-black/2 border-black/5"
        )}>
          <Wallet className="w-4 h-4 text-[hsl(263,70%,58%)] mx-auto mb-1" />
          <p className="text-sm font-bold">{formatNumber(totalDistributed)}</p>
          <p className={cn("text-[9px] uppercase tracking-wider", isDark ? "text-white/40" : "text-gray-400")}>Total</p>
        </div>
        <div className={cn(
          "p-3 rounded-2xl border text-center",
          isDark ? "bg-white/3 border-white/10" : "bg-black/2 border-black/5"
        )}>
          <ArrowUpRight className="w-4 h-4 text-[hsl(142,76%,45%)] mx-auto mb-1" />
          <p className="text-sm font-bold text-[hsl(142,76%,45%)]">+{formatNumber(totalIn)}</p>
          <p className={cn("text-[9px] uppercase tracking-wider", isDark ? "text-white/40" : "text-gray-400")}>In</p>
        </div>
        <div className={cn(
          "p-3 rounded-2xl border text-center",
          isDark ? "bg-white/3 border-white/10" : "bg-black/2 border-black/5"
        )}>
          <ArrowDownRight className="w-4 h-4 text-[hsl(0,84%,60%)] mx-auto mb-1" />
          <p className="text-sm font-bold text-[hsl(0,84%,60%)]">-{formatNumber(totalOut)}</p>
          <p className={cn("text-[9px] uppercase tracking-wider", isDark ? "text-white/40" : "text-gray-400")}>Out</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-3">
        {(["all", "earned", "spent", "bonus", "penalty"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
              filter === type
                ? "bg-[hsl(263,70%,58%)] text-white"
                : isDark
                  ? "bg-white/5 text-white/50 hover:bg-white/10"
                  : "bg-black/5 text-gray-500 hover:bg-black/10"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {(expanded ? filteredTxs : filteredTxs?.slice(0, 5))?.map((tx, i) => {
            const config = typeConfig[tx.type] || typeConfig.earned;
            const Icon = config.icon;
            const isPositive = tx.amount > 0;
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-xl transition-colors group cursor-pointer",
                  isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  config.bg
                )}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.reason}</p>
                  <p className={cn("text-[10px] truncate", isDark ? "text-white/50" : "text-gray-500")}>
                    {tx.userName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-sm font-bold",
                    isPositive ? "text-[hsl(142,76%,45%)]" : "text-[hsl(0,84%,60%)]"
                  )}>
                    {isPositive ? "+" : ""}{tx.amount}
                  </p>
                  <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-gray-400")}>
                    {tx.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse */}
      {filteredTxs && filteredTxs.length > 5 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full mt-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors",
            isDark
              ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              : "bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-700"
          )}
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Show {filteredTxs.length - 5} more</>
          )}
        </motion.button>
      )}

      {/* Footer insight */}
      <div className={cn(
        "mt-4 p-3 rounded-2xl border",
        isDark
          ? "bg-[hsl(263,70%,58%)]/5 border-[hsl(263,70%,58%)]/20"
          : "bg-[hsl(263,70%,58%)]/5 border-[hsl(263,70%,58%)]/10"
      )}>
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-[hsl(263,70%,58%)] mt-0.5 shrink-0" />
          <p className={cn("text-xs leading-relaxed", isDark ? "text-white/70" : "text-gray-600")}>
            <span className="font-semibold text-[hsl(263,70%,58%)]">{formatNumber(totalIn)} coins</span> were earned this week. Consider increasing quiz rewards to boost engagement.
          </p>
        </div>
      </div>
    </motion.div>
  );
}