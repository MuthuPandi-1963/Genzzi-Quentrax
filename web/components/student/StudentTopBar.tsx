// components/student/StudentTopbar.tsx
// ── Student topbar with real user data ─────────────────────────────────────

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Menu,
  PanelLeft,
  PanelLeftClose,
  Search,
  X,
  Sun,
  Moon,
  Bell,
  Flame,
  Coins,
} from "lucide-react";
import { useAuthContext } from "@/context/auth.context";
import { useStudentSidebar } from "./StudentLayout";
import { cn } from "@/lib/utils";

export function StudentTopbar() {
  const { collapsed, setCollapsed, setMobileOpen } = useStudentSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuthContext();
  const router = useRouter();

  const isDark = resolvedTheme === "dark";
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const name = user?.userProfile?.name || user?.username || "Student";
  const avatar = user?.userProfile?.avatar || user?.picture || "";
  const role = user?.userProfile?.role || "STUDENT";
  const coins = user?.userProfile?.coins?.length ?? 0;
  const streak = 7; // Replace with real data

  const notifs = [
    { id: 1, title: "Assessment due soon", desc: "Science Mid-Term due in 3 days", time: "just now", color: "bg-[hsl(330,80%,60%)]" },
    { id: 2, title: "Coins earned!", desc: "You earned 150 coins from Science Quiz", time: "2h ago", color: "bg-[hsl(45,95%,55%)]" },
    { id: 3, title: "Streak milestone", desc: "7-day streak! Keep it up 🔥", time: "1d ago", color: "bg-[hsl(25,95%,55%)]" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 h-16 px-4 lg:px-6 flex items-center gap-4 border-b",
        isDark ? "border-white/10" : "border-black/10"
      )}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: isDark ? "hsla(260,50%,4%,0.75)" : "hsla(260,30%,98%,0.75)",
        zIndex: 40,
        boxShadow: isDark ? "0 4px 24px -4px rgba(0,0,0,0.25)" : "0 4px 24px -4px rgba(0,0,0,0.07)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className={cn(
            "lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
            isDark
              ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              : "bg-black/5 text-gray-600 hover:bg-black/10 hover:text-gray-900"
          )}
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex w-9 h-9 rounded-xl items-center justify-center transition-colors border",
            isDark
              ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border-white/10"
              : "bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700 border-black/10"
          )}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </motion.button>

        {/* Streak pill */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold",
            isDark
              ? "bg-[hsl(25,95%,55%)]/10 border-[hsl(25,95%,55%)]/25 text-[hsl(25,95%,55%)]"
              : "bg-[hsl(25,95%,55%)]/8 border-[hsl(25,95%,55%)]/20 text-[hsl(25,95%,55%)]"
          )}
        >
          <Flame className="w-3.5 h-3.5" />
          {streak} day streak
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto hidden sm:block">
        <div
          className={cn(
            "relative flex items-center rounded-2xl border transition-all duration-300",
            searchFocused
              ? isDark
                ? "border-[hsl(263,70%,58%)]/50 shadow-[0_0_0_3px_hsl(263,70%,58%/0.12)]"
                : "border-[hsl(263,70%,58%)]/40 shadow-[0_0_0_3px_hsl(263,70%,58%/0.08)]"
              : isDark
                ? "border-white/10 bg-white/5"
                : "border-black/10 bg-black/5"
          )}
        >
          <Search
            className={cn(
              "w-4 h-4 ml-3 shrink-0 transition-colors",
              searchFocused ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/40" : "text-gray-400"
            )}
          />
          <input
            type="text"
            placeholder="Search quizzes, topics..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-sm outline-none",
              isDark ? "text-white placeholder:text-white/30" : "text-gray-900 placeholder:text-gray-400"
            )}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className={cn(
                "mr-2 w-5 h-5 rounded-full flex items-center justify-center",
                isDark ? "bg-white/10 text-white/50 hover:text-white" : "bg-black/10 text-gray-400 hover:text-gray-700"
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Coins */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors",
            isDark
              ? "bg-[hsl(45,95%,55%)]/10 border-[hsl(45,95%,55%)]/25 text-[hsl(45,95%,55%)] hover:bg-[hsl(45,95%,55%)]/15"
              : "bg-[hsl(45,95%,55%)]/8 border-[hsl(45,95%,55%)]/20 text-[hsl(45,95%,55%)] hover:bg-[hsl(45,95%,55%)]/12"
          )}
        >
          <Coins className="w-3.5 h-3.5" />
          {coins}
        </div>

        {/* Theme */}
        <motion.button
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center border transition-colors",
            isDark
              ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-[hsl(45,95%,55%)]"
              : "bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:text-[hsl(263,70%,58%)]"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className={cn(
              "relative w-9 h-9 rounded-xl flex items-center justify-center border transition-colors",
              isDark
                ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                : "bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:text-gray-900"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[hsl(330,80%,60%)] text-white text-[9px] font-bold flex items-center justify-center">
              {notifs.length}
            </span>
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0"
                  style={{ zIndex: 9990 }}
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "absolute right-0 top-full mt-2 w-72 rounded-2xl border overflow-hidden",
                    isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10"
                  )}
                  style={{
                    zIndex: 9991,
                    backdropFilter: "blur(16px)",
                    boxShadow: isDark
                      ? "0 16px 48px -8px rgba(139,92,246,0.28)"
                      : "0 16px 48px -8px rgba(139,92,246,0.14)",
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between px-4 py-3 border-b",
                      isDark ? "border-white/10" : "border-black/10"
                    )}
                  >
                    <h3 className="text-sm font-bold">Notifications</h3>
                    <button className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">
                      Clear all
                    </button>
                  </div>
                  {notifs.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                        isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{n.title}</p>
                        <p className={cn("text-xs truncate mt-0.5", isDark ? "text-white/50" : "text-gray-500")}>
                          {n.desc}
                        </p>
                        <p className={cn("text-[10px] mt-1", isDark ? "text-white/30" : "text-gray-400")}>
                          {n.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div
          className={cn(
            "hidden md:flex items-center gap-3 pl-3 border-l",
            isDark ? "border-white/10" : "border-black/10"
          )}
        >
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold">{name}</p>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>{role}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold cursor-pointer overflow-hidden"
            style={{
              boxShadow: "0 0 0 2px hsl(260,50%,4%), 0 0 0 4px hsla(263,70%,58%,0.28)",
            }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}