// components/student/StudentLayout.tsx
// ── Layout wrapper with sidebar + topbar ───────────────────────────────────

"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { StudentSidebar } from "./StudentSidebar";
import { StudentTopbar } from "./StudentTopBar";

interface StudentSidebarCtx {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const StudentSidebarContext = createContext<StudentSidebarCtx>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useStudentSidebar = () => useContext(StudentSidebarContext);

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const saved = localStorage.getItem("student-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("student-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <StudentSidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div
        className={cn(
          "min-h-screen flex transition-colors duration-500",
          isDark ? "bg-[hsl(260,50%,4%)] text-white" : "bg-[hsl(260,30%,98%)] text-[hsl(260,40%,10%)]"
        )}
      >
        <StudentSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <StudentTopbar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </StudentSidebarContext.Provider>
  );
}