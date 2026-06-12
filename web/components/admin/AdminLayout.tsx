"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  hoveredItem: string | null;
  setHoveredItem: (v: string | null) => void;
}

export const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  hoveredItem: null,
  setHoveredItem: () => {},
});

export const useAdminSidebar = () => React.useContext(SidebarContext);

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    (async()=>{
        const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
    })()
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, hoveredItem, setHoveredItem }}>
      <div className={cn(
        "min-h-screen flex transition-colors duration-500",
        isDark
          ? "bg-[hsl(260,50%,4%)] text-white"
          : "bg-[hsl(260,30%,98%)] text-[hsl(260,40%,10%)]"
      )}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}