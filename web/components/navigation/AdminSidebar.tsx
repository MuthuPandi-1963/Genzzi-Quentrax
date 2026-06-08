"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  Library, 
  CheckSquare, 
  Hash, 
  FolderTree, 
  Activity, 
  ShieldAlert, 
  Coins, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const staffNavItems = [
  { name: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { name: "Questions", href: "/staff/questions", icon: HelpCircle },
  { name: "Quizzes", href: "/staff/quizzes", icon: Library },
  { name: "Assessments", href: "/staff/assessments", icon: CheckSquare },
  { name: "Topics", href: "/staff/topics", icon: Hash },
  { name: "Categories", href: "/staff/categories", icon: FolderTree },
  { name: "Users", href: "/staff/users", icon: Users },
  { name: "Reports", href: "/staff/reports", icon: Activity },
];

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Questions", href: "/admin/questions", icon: HelpCircle },
  { name: "Quizzes", href: "/admin/quizzes", icon: Library },
  { name: "Assessments", href: "/admin/assessments", icon: CheckSquare },
  { name: "Topics", href: "/admin/topics", icon: Hash },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
  { name: "Coins", href: "/admin/coins", icon: Coins },
  { name: "Settings", href: "/admin/system", icon: Settings },
];

export default function AdminSidebar({ isStaff = false }: { isStaff?: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = isStaff ? staffNavItems : adminNavItems;
  const themeColor = isStaff ? "blue" : "red";

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full bg-white dark:bg-[#0B0A10] border-r border-black/5 dark:border-white/5 flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5">
        <Link href={isStaff ? "/staff" : "/admin"} className="flex items-center gap-3 overflow-hidden">
          <SiteLogo className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-gradient whitespace-nowrap"
            >
              Quentrax
              <span className={`ml-2 text-xs px-2 py-0.5 rounded bg-${themeColor}-100 text-${themeColor}-700 dark:bg-${themeColor}-900/30 dark:text-${themeColor}-400 align-middle`}>
                {isStaff ? "STAFF" : "ADMIN"}
              </span>
            </motion.span>
          )}
        </Link>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm z-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                  isActive 
                    ? `text-${themeColor}-600 dark:text-${themeColor}-400 font-medium bg-${themeColor}-50 dark:bg-${themeColor}-500/10` 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="adminActiveTab" 
                    className={`absolute inset-0 bg-${themeColor}-50 dark:bg-${themeColor}-500/10 rounded-xl border border-${themeColor}-100 dark:border-${themeColor}-500/20`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={`relative z-10 flex-shrink-0 ${isActive ? `text-${themeColor}-600 dark:text-${themeColor}-400` : ""}`} />
                {!collapsed && (
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                )}
                
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
