// components/admin/UserTable.tsx — Full user data table with sorting

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Users, Search, MoreHorizontal, Ban, Mail, Shield, Crown, UserCheck } from "lucide-react";
import { useUsers } from "@/hooks/useAdmin";
import { getInitials, getStatusColor } from "@/lib/adminFormatters";
import { cn } from "@/lib/utils";

const roleConfig = {
  ADMIN: { icon: Crown, color: "bg-[hsl(330,80%,60%)]/15 text-[hsl(330,80%,60%)]" },
  STAFF: { icon: Shield, color: "bg-[hsl(263,70%,58%)]/15 text-[hsl(263,70%,58%)]" },
  STUDENT: { icon: UserCheck, color: "bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)]" },
};

export function UserTable() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: users, isLoading } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users?.data.length > 0 ? users?.data.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }) : [];

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-3xl border p-6 animate-pulse",
        isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="h-6 w-32 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={cn(
        "rounded-3xl border overflow-hidden",
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-black/5 shadow-lg"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
            )}>
              <Users className="w-5 h-5 text-[hsl(263,70%,58%)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">All Users</h2>
              <p className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                {filteredUsers?.length || 0} of {users?.length || 0} users
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["all", "ADMIN", "STAFF", "STUDENT"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all",
                  roleFilter === role
                    ? "bg-[hsl(263,70%,58%)] text-white"
                    : isDark
                      ? "bg-white/5 text-white/60 hover:bg-white/10"
                      : "bg-black/5 text-gray-500 hover:bg-black/10"
                )}
              >
                {role === "all" ? "All" : role}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className={cn(
          "relative flex items-center rounded-2xl border",
          isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
        )}>
          <Search className={cn("w-4 h-4 ml-3", isDark ? "text-white/40" : "text-gray-400")} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-sm outline-none",
              isDark ? "text-white placeholder:text-white/30" : "text-gray-900 placeholder:text-gray-400"
            )}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "text-left text-[10px] font-bold uppercase tracking-wider",
              isDark ? "text-white/40" : "text-gray-400"
            )}>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Coins</th>
              <th className="px-6 py-3">Quizzes</th>
              <th className="px-6 py-3">Avg Score</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers?.map((user, i) => {
                const role = roleConfig[user.role];
                const RoleIcon = role.icon;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "border-t transition-colors cursor-pointer",
                      isDark
                        ? "border-white/5 hover:bg-white/3"
                        : "border-black/5 hover:bg-black/2"
                    )}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,60%)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className={cn("text-[10px]", isDark ? "text-white/50" : "text-gray-500")}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 w-fit",
                        role.color
                      )}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", getStatusColor(user.status))} />
                        <span className={cn(
                          "text-xs font-medium capitalize",
                          user.status === "active"
                            ? "text-[hsl(142,76%,45%)]"
                            : user.status === "inactive"
                              ? "text-[hsl(38,92%,55%)]"
                              : "text-[hsl(0,84%,60%)]"
                        )}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm font-bold">{user.coins.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm">{user.quizzesTaken}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={cn(
                        "text-sm font-bold",
                        user.avgScore >= 80 ? "text-[hsl(142,76%,45%)]" :
                          user.avgScore >= 60 ? "text-[hsl(38,92%,55%)]" : "text-[hsl(0,84%,60%)]"
                      )}>
                        {user.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={cn("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center",
                          isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                        )}>
                          <Mail className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center",
                          isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                        )}>
                          <Ban className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center",
                          isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-black/10 text-gray-500"
                        )}>
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}