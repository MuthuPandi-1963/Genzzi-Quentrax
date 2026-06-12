"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   LOADING SPINNER — Quentrax Admin
   Glassmorphism backdrop + animated gradient spinner
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Loading() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "fixed inset-0 z-max flex flex-col items-center justify-center",
        "backdrop-blur-glass-heavy transition-colors duration-500",
        isDark
          ? "bg-[hsl(260,50%,4%)]/60"
          : "bg-[hsl(260,30%,98%)]/60"
      )}
    >
      {/* Ambient glow behind spinner */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, hsl(263 70% 58% / 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(263 70% 58% / 0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Spinner container */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={cn(
            "w-16 h-16 rounded-full border-2 border-t-transparent",
            isDark
              ? "border-white/10 border-t-[hsl(263,70%,58%)]"
              : "border-black/10 border-t-[hsl(263,70%,58%)]"
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner ring (counter-rotate) */}
        <motion.div
          className={cn(
            "absolute inset-2 rounded-full border-2 border-t-transparent",
            isDark
              ? "border-white/5 border-t-[hsl(330,80%,60%)]"
              : "border-black/5 border-t-[hsl(330,80%,60%)]"
          )}
          animate={{ rotate: -360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center dot pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, hsl(263,70%,58%), hsl(330,80%,60%))",
              boxShadow: isDark
                ? "0 0 20px 4px hsl(263 70% 58% / 0.4)"
                : "0 0 20px 4px hsl(263 70% 58% / 0.2)",
            }}
          />
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.p
        className={cn(
          "mt-8 text-sm font-medium tracking-wide",
          isDark ? "text-white/50" : "text-gray-500"
        )}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}