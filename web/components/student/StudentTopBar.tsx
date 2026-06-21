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

  const name = user?.userProfile?.name || user?.username || "Student";
  const avatar = user?.userProfile?.avatar || user?.picture || "";
  const role = user?.userProfile?.role || "STUDENT";
  const coins = user?.userProfile?.coins?.length ?? 0;


  const streak = user?.userProfile?.streak ?? 0;

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