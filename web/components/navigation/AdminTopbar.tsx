"use client";

import React from "react";
import { Search, Bell, Shield } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminTopbar({ isStaff = false }: { isStaff?: boolean }) {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) || [];
  const title = segments.length > 1 ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1) : "Dashboard";
  
  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 md:px-8 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">
          {title.replace(/-/g, ' ')}
        </h1>
        {segments.length > 2 && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 font-medium">{segments[2]}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6 ml-4">
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-48 xl:w-64 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-sm"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <Bell size={20} />
          {/* Notification dot */}
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="w-px h-8 bg-black/10 dark:bg-white/10"></div>

        <button className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Admin User</p>
            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
              <Shield size={10} className={isStaff ? "text-blue-500" : "text-red-500"} />
              {isStaff ? "Staff Member" : "System Admin"}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-full  bg-linear-to-tr ${isStaff ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-orange-500'} p-[2px]`}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&style=circle" alt="Avatar" className="w-full h-full rounded-full bg-white dark:bg-gray-900" />
          </div>
        </button>
      </div>
    </header>
  );
}
