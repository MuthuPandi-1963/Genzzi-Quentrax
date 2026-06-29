// components/student/StudentSidebar.tsx
// ── Collapsible student sidebar with real user data ────────────────────────

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Trophy,
  Coins,
  Settings,
  ChevronDown,
  LogOut,
  Zap,
  Flame,
  Layers,
  TrendingUp,
  RotateCcw,
  BarChart2,
  Award,
} from "lucide-react";
import { useAuthContext } from "@/context/auth.context";
import { useStudentSidebar } from "./StudentLayout";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number | string;
  badgeColor?: string;
  children?: NavItem[];
}

/* ── Role-based navigation ───────────────────────────────────────────────── */

const STUDENT_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: BookOpen,
    href: "/quizzes",
    badge: 3,
    badgeColor: "bg-[hsl(263,70%,58%)]",
  },
  {
    id: "assessments",
    label: "Assessments",
    icon: ClipboardList,
    href: "/student/assessments",
    badge: 2,
    badgeColor: "bg-[hsl(330,80%,60%)]",
  },
  {
    id: "progress",
    label: "My Progress",
    icon: TrendingUp,
    href: "/student/progress",
    children: [
      { id: "history", label: "Quiz History", icon: RotateCcw, href: "/student/progress/history" },
      { id: "stats", label: "Performance", icon: BarChart2, href: "/student/progress/stats" },
    ],
  },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/student/leaderboard" },
  { id: "achievements", label: "Achievements", icon: Award, href: "/student/achievements" },
  { id: "coins", label: "My Coins", icon: Coins, href: "/student/coins" },
  { id: "topics", label: "Browse Topics", icon: Layers, href: "/topics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/student/settings" },
];

/* ── Tooltip ─────────────────────────────────────────────────────────────── */

function Tooltip({
  children,
  content,
  side = "right",
  show = true,
}: {
  children: React.ReactNode;
  content: string;
  side?: "left" | "right" | "top" | "bottom";
  show?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!show) return <>{children}</>;

  const updateCoords = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const GAP = 8;
    const map = {
      right: { top: r.top + r.height / 2, left: r.right + GAP },
      left: { top: r.top + r.height / 2, left: r.left - GAP },
      top: { top: r.top - GAP, left: r.left + r.width / 2 },
      bottom: { top: r.bottom + GAP, left: r.left + r.width / 2 },
    };
    setCoords(map[side]);
  };

  const transform = {
    right: "translateY(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
  }[side];

  return (
    <div
      ref={ref}
      className="relative flex items-center"
      onMouseEnter={() => {
        updateCoords();
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "fixed whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold pointer-events-none border shadow-lg",
              isDark
                ? "bg-[hsl(260,45%,9%)] border-white/15 text-white"
                : "bg-white border-black/10 text-[hsl(260,40%,10%)]"
            )}
            style={{
              zIndex: 9999,
              top: coords.top,
              left: coords.left,
              transform,
              boxShadow: isDark
                ? "0 8px 32px -4px rgba(139,92,246,0.25)"
                : "0 8px 32px -4px rgba(139,92,246,0.12)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Nav Item ────────────────────────────────────────────────────────────── */

function SidebarNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [expanded, setExpanded] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasActiveChild = item.children?.some(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/")
  );

  useEffect(() => {
    if (hasActiveChild) setExpanded(true);
  }, [hasActiveChild]);

  useEffect(() => {
    if (!collapsed) setExpanded(false);
  }, [collapsed]);

  useEffect(() => {
    if (!expanded || !collapsed || !item.children) return;
    const handler = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded, collapsed, item.children]);

  const activeStyle = isDark
    ? "bg-[hsl(263,70%,58%)]/12 border-[hsl(263,70%,58%)]/35 text-[hsl(263,70%,58%)]"
    : "bg-[hsl(263,70%,58%)]/8 border-[hsl(263,70%,58%)]/25 text-[hsl(263,70%,58%)]";

  const inactiveStyle = isDark
    ? "bg-transparent border-transparent text-white/65 hover:bg-white/5 hover:text-white"
    : "bg-transparent border-transparent text-gray-500 hover:bg-black/5 hover:text-gray-800";

  const Icon = item.icon;

  // Collapsed + has children → flyout
  if (collapsed && item.children) {
    return (
      <Tooltip content={item.label} side="right" show={!expanded}>
        <div className="relative" ref={flyoutRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 border transition-all duration-200",
              isActive || hasActiveChild ? activeStyle : inactiveStyle
            )}
          >
            <Icon className="w-[18px] h-[18px]" />
          </motion.button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "absolute left-full top-0 ml-3 min-w-[200px] rounded-2xl p-2 border shadow-xl",
                  isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10"
                )}
                style={{
                  zIndex: 9998,
                  boxShadow: isDark
                    ? "0 16px 48px -8px rgba(139,92,246,0.3)"
                    : "0 16px 48px -8px rgba(139,92,246,0.15)",
                }}
              >
                <div
                  className={cn(
                    "px-3 py-2 text-xs font-bold uppercase tracking-wider mb-1",
                    isDark ? "text-white/40" : "text-gray-400"
                  )}
                >
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    onClick={() => setExpanded(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      pathname === child.href
                        ? isDark
                          ? "text-[hsl(263,70%,58%)]"
                          : "text-[hsl(263,70%,58%)]"
                        : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                    )}
                  >
                    <child.icon className="w-4 h-4" />
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tooltip>
    );
  }

  // Collapsed leaf
  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        <Link href={item.href} className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-1 border transition-all duration-200",
              isActive ? activeStyle : inactiveStyle
            )}
          >
            <Icon className="w-5 h-5" />
            {item.badge && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white",
                  item.badgeColor || "bg-[hsl(330,80%,60%)]"
                )}
              >
                {typeof item.badge === "number" ? (item.badge > 9 ? "9+" : item.badge) : item.badge}
              </span>
            )}
          </motion.div>
        </Link>
      </Tooltip>
    );
  }

  // Expanded with children
  if (item.children) {
    return (
      <div>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium border transition-all duration-200",
            isActive || hasActiveChild ? activeStyle : inactiveStyle
          )}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-1 pb-1 space-y-0.5">
                {item.children.map((child) => (
                  <Link key={child.id} href={child.href} className="block">
                    <motion.div
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium border transition-all duration-200 ml-6",
                        pathname === child.href
                          ? activeStyle
                          : isDark
                            ? "bg-transparent border-transparent text-white/55 hover:bg-white/5 hover:text-white/90"
                            : "bg-transparent border-transparent text-gray-400 hover:bg-black/5 hover:text-gray-700"
                      )}
                    >
                      <child.icon className="w-[15px] h-[15px] flex-shrink-0" />
                      <span className="flex-1">{child.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Expanded leaf
  return (
    <Link href={item.href} className="block">
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium border transition-all duration-200",
          isActive ? activeStyle : inactiveStyle
        )}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white",
              item.badgeColor || "bg-[hsl(330,80%,60%)]"
            )}
          >
            {item.badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}

/* ── Sidebar Content ─────────────────────────────────────────────────────── */

function SidebarContent({
  collapsed,
  setCollapsed,
  setMobileOpen,
  isMobile,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  setMobileOpen: (v: boolean) => void;
  isMobile: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const { user, logout } = useAuthContext();
  const isDark = resolvedTheme === "dark";

  const name = user?.userProfile?.name || user?.username || "Student";
  const email = user?.email || "";
  const avatar = user?.userProfile?.avatar || user?.picture || "";
  const coins = user?.userProfile?.coins?.length ?? 0;
  const streak = 7; // Replace with real streak data

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b flex-shrink-0",
          isDark ? "border-white/10" : "border-black/10"
        )}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="exp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center shadow-lg shadow-[hsl(263,70%,58%)]/20 flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight">
                  <span className="text-gradient">Quentrax</span>
                </h1>
                <p
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-widest truncate",
                    isDark ? "text-white/40" : "text-gray-400"
                  )}
                >
                  Student Portal
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="col"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="mx-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coins + streak pill */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className={cn(
              "mx-3 mt-3 rounded-2xl px-3 py-2.5 flex items-center gap-3 border",
              isDark ? "bg-white/4 border-white/8" : "bg-black/3 border-black/8"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[hsl(45,95%,55%)]" />
              <span className="text-sm font-bold text-[hsl(45,95%,55%)]">{coins}</span>
            </div>
            <div className={cn("w-px h-4", isDark ? "bg-white/10" : "bg-black/10")} />
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[hsl(25,95%,55%)]" />
              <span className="text-sm font-bold text-[hsl(25,95%,55%)]">{streak} day streak</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 no-scrollbar">
        {STUDENT_NAV.map((item) => (
          <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer - User Profile */}
      <div
        className={cn(
          "p-3 border-t shrink-0",
          isDark ? "border-white/10" : "border-black/10"
        )}
      >
        {!collapsed ? (
          <div
            className={cn(
              "rounded-2xl p-3 border flex items-center gap-3",
              isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
            )}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{name}</p>
              <p className={cn("text-xs truncate", isDark ? "text-white/50" : "text-gray-500")}>
                {email}
              </p>
            </div>
            <Tooltip content="Logout" side="top">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isDark
                    ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10"
                    : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10"
                )}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Tooltip content={name} side="right">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                {name.charAt(0).toUpperCase()}
              </div>
            </Tooltip>
            <Tooltip content="Logout" side="right">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                  isDark
                    ? "text-white/50 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10"
                    : "text-gray-400 hover:text-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/10"
                )}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Sidebar Component ──────────────────────────────────────────────── */

export function StudentSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useStudentSidebar();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const bgStyle = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    backgroundColor: isDark ? "hsla(260,50%,4%,0.88)" : "hsla(260,30%,98%,0.88)",
    borderRight: isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.09)",
    boxShadow: isDark
      ? "4px 0 24px -4px rgba(139,92,246,0.15)"
      : "4px 0 24px -4px rgba(139,92,246,0.08)",
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 lg:hidden"
            style={{ zIndex: 200, backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 272 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0"
        style={{ zIndex: 50 }}
      >
        <div className="absolute inset-0" style={bgStyle} />
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
          isMobile={false}
        />
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen flex flex-col lg:hidden"
            style={{ width: 272, zIndex: 300, ...bgStyle }}
          >
            <SidebarContent
              collapsed={false}
              setCollapsed={setCollapsed}
              setMobileOpen={setMobileOpen}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}