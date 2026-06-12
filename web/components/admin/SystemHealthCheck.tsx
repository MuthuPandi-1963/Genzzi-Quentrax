// components/admin/SystemHealthCheck.tsx — System status & health metrics

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Heart, Cpu, Database, Wifi, Server, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { cn } from "@/lib/utils";

interface HealthMetric {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
  icon: React.ElementType;
  detail: string;
}

const healthMetrics: HealthMetric[] = [
  { name: "API Server", value: 99.9, status: "healthy", icon: Server, detail: "3ms avg response" },
  { name: "Database", value: 97.5, status: "healthy", icon: Database, detail: "142ms query time" },
  { name: "WebSocket", value: 100, status: "healthy", icon: Wifi, detail: "2,847 connections" },
  { name: "CPU Usage", value: 68, status: "warning", icon: Cpu, detail: "4/8 cores active" },
  { name: "Memory", value: 82, status: "warning", icon: Activity, detail: "13.1 / 16 GB" },
];

const statusConfig = {
  healthy: { color: "hsl(142,76%,45%)", bg: "bg-[hsl(142,76%,45%)]/15", text: "text-[hsl(142,76%,45%)]", icon: CheckCircle2 },
  warning: { color: "hsl(38,92%,55%)", bg: "bg-[hsl(38,92%,55%)]/15", text: "text-[hsl(38,92%,55%)]", icon: AlertTriangle },
  critical: { color: "hsl(0,84%,60%)", bg: "bg-[hsl(0,84%,60%)]/15", text: "text-[hsl(0,84%,60%)]", icon: AlertTriangle },
};

export function SystemHealthCheck() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const overallHealth = Math.round(
    healthMetrics.reduce((acc, m) => acc + m.value, 0) / healthMetrics.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
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
            isDark ? "bg-white/10" : "bg-[hsl(142,76%,45%)]/10"
          )}>
            <Heart className={cn(
              "w-5 h-5",
              overallHealth > 90 ? "text-[hsl(142,76%,45%)]" : "text-[hsl(38,92%,55%)]"
            )} />
          </div>
          <div>
            <h2 className="text-lg font-bold">System Health</h2>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
              All systems operational
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            overallHealth > 90 ? "bg-[hsl(142,76%,45%)]" : "bg-[hsl(38,92%,55%)]"
          )} />
          <span className={cn(
            "text-xs font-bold",
            overallHealth > 90 ? "text-[hsl(142,76%,45%)]" : "text-[hsl(38,92%,55%)]"
          )}>
            {overallHealth}% Healthy
          </span>
        </div>
      </div>

      {/* Overall Health Ring */}
      <div className="flex items-center justify-center mb-6">
        <ProgressRing
          progress={overallHealth}
          size={120}
          strokeWidth={10}
          color={overallHealth > 90 ? "hsl(142,76%,45%)" : "hsl(38,92%,55%)"}
        >
          <div className="text-center">
            <p className={cn(
              "text-3xl font-black",
              overallHealth > 90 ? "text-[hsl(142,76%,45%)]" : "text-[hsl(38,92%,55%)]"
            )}>
              {overallHealth}%
            </p>
            <p className={cn("text-[10px] uppercase tracking-wider mt-0.5", isDark ? "text-white/50" : "text-gray-500")}>
              Uptime
            </p>
          </div>
        </ProgressRing>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-3">
        {healthMetrics.map((metric, i) => {
          const config = statusConfig[metric.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl transition-colors",
                isDark ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                config.bg
              )}>
                <metric.icon className={cn("w-4 h-4", config.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className={cn("text-xs font-bold", config.text)}>{metric.value}%</span>
                </div>
                <div className={cn(
                  "h-1.5 rounded-full overflow-hidden",
                  isDark ? "bg-white/10" : "bg-black/10"
                )}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                <p className={cn("text-[10px] mt-1", isDark ? "text-white/40" : "text-gray-400")}>
                  {metric.detail}
                </p>
              </div>
              <StatusIcon className={cn("w-4 h-4 shrink-0", config.text)} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}