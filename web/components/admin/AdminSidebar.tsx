"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, ClipboardList,
  Trophy, Coins, Shield, Settings, ChevronDown, Zap, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminSidebar } from "./AdminLayout";
import { AdminTooltip } from "./AdminTooltip";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: number | string;
  badgeColor?: string;
  children?: NavItem[];
}

const ADMIN_NAVIGATION: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users", badge: 12, badgeColor: "bg-[hsl(142,76%,45%)]" },
  {
    id: "content", label: "Content", icon: BookOpen,
    children: [
      { id: "categories", label: "Categories", icon: Trophy, href: "/admin/categories" },
      { id: "topics", label: "Topics", icon: BookOpen, href: "/admin/topics" },
      { id: "questions", label: "Questions", icon: FileQuestion, href: "/admin/questions", badge: 234 },
      { id: "quizzes", label: "Quizzes", icon: ClipboardList, href: "/admin/quizzes" },
    ],
  },
  { id: "assessments", label: "Assessments", icon: ClipboardList, href: "/admin/assessments", badge: "NEW", badgeColor: "bg-[hsl(330,80%,60%)]" },
  {
    id: "gamification", label: "Gamification", icon: Trophy,
    children: [
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/admin/leaderboard" },
      { id: "coins", label: "Coins", icon: Coins, href: "/admin/coins" },
      { id: "achievements", label: "Achievements", icon: Zap, href: "/admin/achievements" },
    ],
  },
  {
    id: "analytics", label: "Analytics", icon: Shield,
    children: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin/analytics" },
      { id: "quiz-stats", label: "Quiz Stats", icon: ClipboardList, href: "/admin/analytics/quizzes" },
      { id: "user-activity", label: "User Activity", icon: Users, href: "/admin/analytics/users" },
    ],
  },
  {
    id: "security", label: "Security", icon: Shield,
    children: [
      { id: "audit-logs", label: "Audit Logs", icon: ClipboardList, href: "/admin/audit-logs" },
      { id: "device-tracking", label: "Devices", icon: Shield, href: "/admin/devices" },
      { id: "roles", label: "Roles & Perms", icon: Shield, href: "/admin/roles" },
    ],
  },
  { id: "communications", label: "Communications", icon: Users, href: "/admin/communications" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

function NavLink({ item, depth = 0, collapsed, onNavigate }: {
  item: NavItem; depth?: number; collapsed: boolean; onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { setHoveredItem } = useAdminSidebar();
  const isActive = pathname === item.href || pathname.startsWith((item.href ?? "") + "/");
  const Icon = item.icon;

  if (collapsed && depth === 0) {
    return (
      <AdminTooltip content={item.label} side="right">
        <Link href={item.href || "#"} className="block" onClick={onNavigate}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 transition-all duration-200 border",
              isActive
                ? isDark
                  ? "bg-[hsl(263,70%,58%)]/15 border-[hsl(263,70%,58%)]/40 text-[hsl(263,70%,58%)]"
                  : "bg-[hsl(263,70%,58%)]/10 border-[hsl(263,70%,58%)]/30 text-[hsl(263,70%,58%)]"
                : isDark
                  ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  : "bg-black/5 border-black/10 text-gray-600 hover:bg-black/10 hover:text-gray-900"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Icon className="w-5 h-5" />
            {item.badge && (
              <span className={cn(
                "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white",
                item.badgeColor || "bg-[hsl(330,80%,60%)]"
              )}>
                {typeof item.badge === "number" ? (item.badge > 99 ? "99+" : item.badge) : item.badge}
              </span>
            )}
          </motion.div>
        </Link>
      </AdminTooltip>
    );
  }

  return (
    <Link href={item.href || "#"} className="block" onClick={onNavigate}>
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 border",
          isActive
            ? isDark
              ? "bg-[hsl(263,70%,58%)]/10 border-[hsl(263,70%,58%)]/30 text-[hsl(263,70%,58%)]"
              : "bg-[hsl(263,70%,58%)]/8 border-[hsl(263,70%,58%)]/20 text-[hsl(263,70%,58%)]"
            : isDark
              ? "bg-transparent border-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
              : "bg-transparent border-transparent text-gray-500 hover:bg-black/5 hover:text-gray-800",
          collapsed && "justify-center w-11 h-11 mx-auto px-0"
        )}
        style={{ marginLeft: collapsed ? 0 : depth * 12 + 12 }}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white",
                item.badgeColor || "bg-[hsl(330,80%,60%)]"
              )}>
                {typeof item.badge === "number" ? (item.badge > 99 ? "99+" : item.badge) : item.badge}
              </span>
            )}
          </>
        )}
      </motion.div>
    </Link>
  );
}

function NavCollapsible({ item, depth = 0, collapsed }: { item: NavItem; depth?: number; collapsed: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { setHoveredItem } = useAdminSidebar();
  const flyoutRef = useRef<HTMLDivElement>(null);

  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false;
  const hasActiveChild = item.children?.some((c) => pathname === c.href || pathname.startsWith((c.href ?? "") + "/"));

  useEffect(() => { if (hasActiveChild) (async()=>setExpanded(true))(); }, [hasActiveChild]);
  useEffect(() => { if (!collapsed) (async()=>setExpanded(false))(); }, [collapsed]);

  useEffect(() => {
    if (!expanded || !collapsed) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, collapsed]);

  const Icon = item.icon;
  const paddingLeft = depth * 12 + (collapsed ? 0 : 12);

  if (collapsed && depth === 0 && item.children) {
    return (
      <AdminTooltip content={item.label} side="right" show={!expanded}>
        <div className="relative group" ref={flyoutRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 transition-all duration-200 border",
              isActive || hasActiveChild
                ? isDark
                  ? "bg-[hsl(263,70%,58%)]/15 border-[hsl(263,70%,58%)]/40 text-[hsl(263,70%,58%)]"
                  : "bg-[hsl(263,70%,58%)]/10 border-[hsl(263,70%,58%)]/30 text-[hsl(263,70%,58%)]"
                : isDark
                  ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  : "bg-black/5 border-black/10 text-gray-600 hover:bg-black/10 hover:text-gray-900"
            )}
          >
            <Icon className="w-4.5 h-4.5" />
            {item.badge && (
              <span className={cn(
                "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white",
                item.badgeColor || "bg-[hsl(330,80%,60%)]"
              )}>
                {typeof item.badge === "number" ? (item.badge > 99 ? "99+" : item.badge) : item.badge}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "absolute left-full top-0 ml-3 min-w-50 rounded-2xl p-2 border shadow-xl",
                  isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10"
                )}
                style={{
                  zIndex: 9998,
                  boxShadow: isDark
                    ? "0 16px 48px -8px rgba(139, 92, 246, 0.3)"
                    : "0 16px 48px -8px rgba(139, 92, 246, 0.15)",
                }}
              >
                <div className={cn("px-3 py-2 text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-white/40" : "text-gray-400")}>
                  {item.label}
                </div>
                {item.children?.map((child) => (
                  <NavLink key={child.id} item={child} depth={depth + 1} collapsed={false} onNavigate={() => setExpanded(false)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AdminTooltip>
    );
  }

  return (
    <div>
      <AdminTooltip content={item.label} side="right" show={collapsed && depth === 0 && !item.children}>
        {item.children ? (
          <motion.button
            whileHover={{ x: collapsed ? 0 : 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border",
              isActive || hasActiveChild
                ? isDark
                  ? "bg-[hsl(263,70%,58%)]/10 border-[hsl(263,70%,58%)]/30 text-[hsl(263,70%,58%)]"
                  : "bg-[hsl(263,70%,58%)]/8 border-[hsl(263,70%,58%)]/20 text-[hsl(263,70%,58%)]"
                : isDark
                  ? "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  : "bg-transparent border-transparent text-gray-600 hover:bg-black/5 hover:text-gray-900",
              collapsed && "justify-center w-11 h-11 mx-auto px-0"
            )}
            style={{ marginLeft: collapsed ? 0 : paddingLeft }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Icon className={cn("w-4.5 h-4.5 shrink-0", collapsed && "w-5 h-5")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn("px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white", item.badgeColor || "bg-[hsl(330,80%,60%)]")}>
                    {item.badge}
                  </span>
                )}
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </motion.div>
              </>
            )}
          </motion.button>
        ) : (
          <Link href={item.href || "#"} className="block">
            <motion.div
              whileHover={{ x: collapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border",
                isActive
                  ? isDark
                    ? "bg-[hsl(263,70%,58%)]/10 border-[hsl(263,70%,58%)]/30 text-[hsl(263,70%,58%)]"
                    : "bg-[hsl(263,70%,58%)]/8 border-[hsl(263,70%,58%)]/20 text-[hsl(263,70%,58%)]"
                  : isDark
                    ? "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                    : "bg-transparent border-transparent text-gray-600 hover:bg-black/5 hover:text-gray-900",
                collapsed && "justify-center w-11 h-11 mx-auto px-0"
              )}
              style={{ marginLeft: collapsed ? 0 : paddingLeft }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon className={cn("w-4.5 h-4.5 shrink-0", collapsed && "w-5 h-5")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn("px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white", item.badgeColor || "bg-[hsl(330,80%,60%)]")}>
                      {typeof item.badge === "number" ? (item.badge > 99 ? "99+" : item.badge) : item.badge}
                    </span>
                  )}
                </>
              )}
            </motion.div>
          </Link>
        )}
      </AdminTooltip>

      <AnimatePresence>
        {expanded && item.children && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-0.5">
              {item.children.map((child) => (
                <NavLink key={child.id} item={child} depth={depth + 1} collapsed={collapsed} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ collapsed }: {
  collapsed: boolean; setCollapsed: (v: boolean) => void; setMobileOpen: (v: boolean) => void; isMobile: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative flex flex-col h-full w-full">
      <div className={cn("flex items-center h-16 px-4 border-b shrink-0", isDark ? "border-white/10" : "border-black/10")}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center shadow-lg shadow-[hsl(263,70%,58%)]/20 shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight">
                  <span className="bg-linear-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] bg-clip-text text-transparent">Quentrax</span>
                </h1>
                <p className={cn("text-[10px] font-semibold uppercase tracking-widest truncate", isDark ? "text-white/40" : "text-gray-400")}>
                  Admin Panel
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center shadow-lg shadow-[hsl(263,70%,58%)]/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 no-scrollbar">
        {ADMIN_NAVIGATION.map((item) => (
          <NavCollapsible key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className={cn("p-3 border-t shrink-0", isDark ? "border-white/10" : "border-black/10")}>
        {!collapsed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("rounded-2xl p-3 border", isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10")}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className={cn("text-xs truncate", isDark ? "text-white/50" : "text-gray-500")}>admin@quentrax.io</p>
              </div>
              <AdminTooltip content="Logout" side="top">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isDark ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10" : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10")}
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </AdminTooltip>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <AdminTooltip content="Admin User" side="right">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                AD
              </div>
            </AdminTooltip>
            <AdminTooltip content="Logout" side="right">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-colors", isDark ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10" : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10")}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </AdminTooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useAdminSidebar();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-sticky lg:hidden"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0"
        style={{ zIndex: 50 }}
      >
        <div
          className={cn("absolute inset-0 border-r", isDark ? "border-white/10" : "border-black/10")}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: isDark ? "hsla(260, 50%, 4%, 0.85)" : "hsla(260, 30%, 98%, 0.85)",
            boxShadow: isDark ? "4px 0 24px -4px rgba(139, 92, 246, 0.15)" : "4px 0 24px -4px rgba(139, 92, 246, 0.08)",
          }}
        />
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} isMobile={false} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen flex flex-col lg:hidden"
            style={{
              width: 280,
              zIndex: 300,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              backgroundColor: isDark ? "hsla(260, 50%, 4%, 0.95)" : "hsla(260, 30%, 98%, 0.95)",
              borderRight: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              boxShadow: isDark ? "4px 0 24px -4px rgba(139, 92, 246, 0.2)" : "4px 0 24px -4px rgba(139, 92, 246, 0.1)",
            }}
          >
            <SidebarContent collapsed={false} setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} isMobile={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}