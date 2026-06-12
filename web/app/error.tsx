"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════════
   ERROR BOUNDARY — Quentrax Admin
   Glassmorphism card with error details and recovery actions
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    // Log to error tracking service
    console.error("Admin Error Boundary:", error);
  }, [error]);

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
            "absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl",
            isDark ? "bg-[hsl(0,84%,60%)]/8" : "bg-[hsl(0,84%,60%)]/4"
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(
            "absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl",
            isDark ? "bg-[hsl(263,70%,58%)]/8" : "bg-[hsl(263,70%,58%)]/4"
          )}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
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
          "relative max-w-xl w-full rounded-2xl border backdrop-blur-glass p-8 md:p-12",
          isDark
            ? "bg-[hsl(260,45%,7%)]/80 border-white/10"
            : "bg-white/80 border-black/10 shadow-xl"
        )}
        style={{
          boxShadow: isDark
            ? "0 16px 48px -8px rgba(139, 92, 246, 0.15), inset 0 1px 0 0 rgba(255,255,255,0.08)"
            : "0 16px 48px -8px rgba(139, 92, 246, 0.08), inset 0 1px 0 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Error Icon */}
        <motion.div
          className="mx-auto mb-6 relative w-20 h-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl flex items-center justify-center",
              isDark
                ? "bg-[hsl(0,84%,60%)]/10 border border-[hsl(0,84%,60%)]/20"
                : "bg-[hsl(0,84%,60%)]/8 border border-[hsl(0,84%,60%)]/15"
            )}
            animate={{
              boxShadow: [
                "0 0 0 0 hsl(0 84% 60% / 0)",
                "0 0 20px 4px hsl(0 84% 60% / 0.15)",
                "0 0 0 0 hsl(0 84% 60% / 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <AlertTriangle className="w-8 h-8 text-[hsl(0,84%,60%)]" />
          </motion.div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
            style={{
              background: isDark ? "hsl(0 84% 60% / 0.1)" : "hsl(0 84% 60% / 0.08)",
              borderColor: isDark ? "hsl(0 84% 60% / 0.2)" : "hsl(0 84% 60% / 0.15)",
              color: "hsl(0,84%,60%)",
            }}
          >
            <Bug className="w-3 h-3" />
            {error.digest ? `Error ${error.digest.slice(0, 8)}` : "Runtime Error"}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className={cn(
            "text-2xl md:text-3xl font-black text-center mb-3",
            isDark ? "text-white" : "text-gray-900"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Something went wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          className={cn(
            "text-sm md:text-base text-center mb-6 max-w-md mx-auto leading-relaxed",
            isDark ? "text-white/60" : "text-gray-500"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          An unexpected error occurred while rendering this page. 
          Try refreshing or go back to the dashboard.
        </motion.p>

        {/* Error Details (collapsible) */}
        <motion.div
          className={cn(
            "mb-8 rounded-2xl border overflow-hidden",
            isDark
              ? "bg-[hsl(0,84%,60%)]/5 border-[hsl(0,84%,60%)]/10"
              : "bg-[hsl(0,84%,60%)]/3 border-[hsl(0,84%,60%)]/8"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className={cn(
            "px-4 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider",
            isDark ? "text-[hsl(0,84%,60%)]/70 border-b border-[hsl(0,84%,60%)]/10" : "text-[hsl(0,84%,60%)]/60 border-b border-[hsl(0,84%,60%)]/8"
          )}>
            <Bug className="w-3.5 h-3.5" />
            Error Details
          </div>
          <div className="p-4">
            <p className={cn(
              "text-xs font-mono leading-relaxed break-all",
              isDark ? "text-white/50" : "text-gray-500"
            )}>
              {error.message || "Unknown error occurred"}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className={cn(
                  "text-xs cursor-pointer hover:text-[hsl(263,70%,58%)] transition-colors",
                  isDark ? "text-white/40" : "text-gray-400"
                )}>
                  View stack trace
                </summary>
                <pre className={cn(
                  "mt-2 text-[10px] font-mono leading-relaxed overflow-auto max-h-32 p-2 rounded-lg",
                  isDark ? "bg-black/30 text-white/40" : "bg-gray-100 text-gray-500"
                )}>
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={reset}
            className={cn(
              "gradient-primary px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2",
              "shadow-lg w-full sm:w-auto"
            )}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            Try Again
          </motion.button>

          <Link href="/admin" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-colors w-full",
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-black/10 text-gray-800 hover:bg-black/5"
              )}
            >
              <Home className="w-4 h-4" />
              Dashboard
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
                "px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-colors w-full",
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
      </motion.div>
    </div>
  );
}