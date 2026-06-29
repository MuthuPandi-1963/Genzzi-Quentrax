// app/student/settings/page.tsx
// ── Student Settings Page ────────────────────────────────────────────────────

"use client";

import { useTheme } from "next-themes";
import { useAuthContext } from "@/context/auth.context";
import { StudentLayout } from "@/components/student/StudentLayout";
import { motion } from "framer-motion";
import { User, Mail, Moon, Sun, Monitor, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function StudentSettingsPage() {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user?.userProfile?.name || user?.username || "Student";
  const email = user?.email || "student@example.com";
  const role = user?.userProfile?.role || "STUDENT";

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your account preferences and personal information.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6"
        >
          {/* Profile Section */}
          <section className="p-6 rounded-3xl border bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Profile Details</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                <div className="px-4 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-sm">
                  {name}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="px-4 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                  {email}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Role</label>
                <div className="px-4 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 capitalize">
                  <Shield className="w-4 h-4" />
                  {role.toLowerCase()}
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="p-6 rounded-3xl border bg-white/80 dark:bg-white/5 border-black/5 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Sun className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 block">Theme Appearance</label>
                {mounted && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        theme === "light"
                          ? "bg-violet-500 text-white border-violet-600 shadow-md"
                          : "bg-white/50 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                      )}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        theme === "dark"
                          ? "bg-violet-500 text-white border-violet-600 shadow-md"
                          : "bg-white/50 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                      )}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                        theme === "system"
                          ? "bg-violet-500 text-white border-violet-600 shadow-md"
                          : "bg-white/50 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                      )}
                    >
                      <Monitor className="w-4 h-4" /> System
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
