"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  SearchX,
  ArrowLeft,
  Home,
  Compass,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   NOT FOUND (404) — Quentrax Admin
   Glassmorphism card with animated elements
   ═══════════════════════════════════════════════════════════════════════════ */

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-4rem)] flex items-center justify-center px-4",
        "transition-colors duration-500"
      )}
    >
      {/* Background ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={cn(
            "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl",
            isDark ? "bg-[hsl(263,70%,58%)]/10" : "bg-[hsl(263,70%,58%)]/5"
          )}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl",
            isDark ? "bg-[hsl(330,80%,60%)]/10" : "bg-[hsl(330,80%,60%)]/5"
          )}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative max-w-lg w-full text-center rounded-2xl border backdrop-blur-glass p-10 md:p-14",
          isDark
            ? "bg-[hsl(260,45%,7%)]/80 border-white/10"
            : "bg-white/80 border-black/10 shadow-xl"
        )}
        style={{
          boxShadow: isDark
            ? "0 16px 48px -8px rgba(139, 92, 246, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.08)"
            : "0 16px 48px -8px rgba(139, 92, 246, 0.1), inset 0 1px 0 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* 404 Icon */}
        <motion.div
          className="mx-auto mb-6 relative w-24 h-24"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-3xl flex items-center justify-center",
              isDark
                ? "bg-white/5 border border-white/10"
                : "bg-black/5 border border-black/10"
            )}
          >
            <SearchX className="w-10 h-10 text-[hsl(263,70%,58%)]" />
          </div>
          {/* Orbiting dot */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(263,70%,58%), hsl(330,80%,60%))",
                boxShadow: "0 0 12px 2px hsl(263 70% 58% / 0.5)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* 404 Code */}
        <motion.h1
          className="text-7xl md:text-8xl font-black tracking-tighter mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-gradient">404</span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          className={cn(
            "text-xl md:text-2xl font-bold mb-3",
            isDark ? "text-white" : "text-gray-900"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className={cn(
            "text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed",
            isDark ? "text-white/60" : "text-gray-500"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or navigate back to safety.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/admin" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "gradient-primary px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2",
                "shadow-lg"
              )}
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </motion.div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-colors",
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-black/10 text-gray-800 hover:bg-black/5"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.div>
          </button>
        </motion.div>

        {/* Decorative footer links */}
        <motion.div
          className={cn(
            "mt-8 pt-6 border-t flex items-center justify-center gap-6 text-xs font-medium",
            isDark ? "border-white/10 text-white/40" : "border-black/10 text-gray-400"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/admin/quizzes" className="flex items-center gap-1.5 hover:text-[hsl(263,70%,58%)] transition-colors">
            <Compass className="w-3.5 h-3.5" />
            Quizzes
          </Link>
          <Link href="/admin/assessments" className="flex items-center gap-1.5 hover:text-[hsl(263,70%,58%)] transition-colors">
            <Zap className="w-3.5 h-3.5" />
            Assessments
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-1.5 hover:text-[hsl(263,70%,58%)] transition-colors">
            <Home className="w-3.5 h-3.5" />
            Settings
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}