"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Library, 
  CheckSquare, 
  Wallet, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Quizzes", href: "/my-quizzes", icon: Library },
  { name: "My Assessments", href: "/my-assessments", icon: CheckSquare },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full bg-white dark:bg-[#0B0A10] border-r border-black/5 dark:border-white/5 flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <SiteLogo className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-gradient whitespace-nowrap"
            >
              Quentrax
            </motion.span>
          )}
        </Link>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-purple-500 shadow-sm z-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                  isActive 
                    ? "text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-500/10" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20" 
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={`relative z-10 flex-shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                {!collapsed && (
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <button className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
