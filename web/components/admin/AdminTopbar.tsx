"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, ChevronRight, Search, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminSidebar } from "./AdminLayout";
import { AdminTooltip } from "./AdminTooltip";
import { NotificationDropdown } from "./NotifciationDropdown";

export function AdminTopbar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useAdminSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header
      className={cn("sticky top-0 h-16 px-4 lg:px-6 flex items-center gap-4 border-b", isDark ? "border-white/10" : "border-black/10")}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: isDark ? "hsla(260, 50%, 4%, 0.75)" : "hsla(260, 30%, 98%, 0.75)",
        zIndex: 40,
        boxShadow: isDark ? "0 4px 24px -4px rgba(0,0,0,0.3)" : "0 4px 24px -4px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn("lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors", isDark ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white" : "bg-black/5 text-gray-600 hover:bg-black/10 hover:text-gray-900")}
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <AdminTooltip content={collapsed ? "Expand sidebar" : "Collapse sidebar"} side="bottom">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className={cn("hidden lg:flex w-9 h-9 rounded-xl items-center justify-center transition-colors border", isDark ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border-white/10" : "bg-black/5 text-gray-400 hover:bg-black/10 hover:text-gray-700 border-black/10")}
          >
            {collapsed ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>}
          </motion.button>
        </AdminTooltip>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          <span className={cn("font-medium", isDark ? "text-white/40" : "text-gray-400")}>Admin</span>
          <ChevronRight className={cn("w-3.5 h-3.5", isDark ? "text-white/20" : "text-gray-300")} />
          <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Dashboard</span>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden sm:block">
        <div className={cn(
          "relative flex items-center rounded-2xl border transition-all duration-300",
          searchFocused
            ? isDark ? "border-[hsl(263,70%,58%)]/50" : "border-[hsl(263,70%,58%)]/40"
            : isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
        )}>
          <Search className={cn("w-4 h-4 ml-3 shrink-0 transition-colors", searchFocused ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/40" : "text-gray-400")} />
          <input
            type="text"
            placeholder="Search users, quizzes, assessments..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn("w-full bg-transparent px-3 py-2.5 text-sm outline-none", isDark ? "text-white placeholder:text-white/30" : "text-gray-900 placeholder:text-gray-400")}
          />
          {searchValue && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setSearchValue("")} className={cn("mr-2 w-5 h-5 rounded-full flex items-center justify-center", isDark ? "bg-white/10 text-white/50 hover:text-white" : "bg-black/10 text-gray-400 hover:text-gray-700")}>
              <X className="w-3 h-3" />
            </motion.button>
          )}
          <div className={cn("hidden md:flex items-center gap-1 mr-3 px-1.5 py-0.5 rounded-md text-[10px] font-mono", isDark ? "bg-white/10 text-white/40" : "bg-black/10 text-gray-400")}>
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AdminTooltip content={isDark ? "Light mode" : "Dark mode"} side="bottom">
          <motion.button
            whileHover={{ scale: 1.08, rotate: 15 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-colors border", isDark ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-[hsl(45,95%,55%)]" : "bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:text-[hsl(263,70%,58%)]")}
          >
            <AnimatePresence mode="wait">
              <motion.div key={isDark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </AdminTooltip>

        <NotificationDropdown isDark={isDark} notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} />

        <div className={cn("hidden md:flex items-center gap-3 pl-3 border-l", isDark ? "border-white/10" : "border-black/10")}>
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold">Admin User</p>
            <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>Super Admin</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            style={{ boxShadow: "0 0 0 2px hsl(260,50%,4%), 0 0 0 4px hsla(263,70%,58%,0.3)" }}
          >
            AD
          </motion.div>
        </div>
      </div>
    </header>
  );
}