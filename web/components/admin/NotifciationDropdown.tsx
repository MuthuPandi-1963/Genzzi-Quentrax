"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminTooltip } from "./AdminTooltip";

const notifications = [
  { id: 1, title: "New user registered", desc: "sarah.chen@email.com joined", time: "2m ago", type: "user" as const },
  { id: 2, title: "Quiz completed", desc: "Marcus scored 95% on Science Quiz", time: "15m ago", type: "quiz" as const },
  { id: 3, title: "Assessment deadline", desc: "Math Final due in 2 hours", time: "1h ago", type: "alert" as const },
  { id: 4, title: "Security alert", desc: "New device login from Tokyo", time: "3h ago", type: "security" as const },
];

const notificationColors = {
  user: "bg-[hsl(142,76%,45%)]",
  quiz: "bg-[hsl(263,70%,58%)]",
  alert: "bg-[hsl(38,92%,55%)]",
  security: "bg-[hsl(0,84%,60%)]",
};

export function NotificationDropdown({ isDark, notificationsOpen, setNotificationsOpen }: {
  isDark: boolean;
  notificationsOpen: boolean;
  setNotificationsOpen: (val: boolean) => void;
}) {
  return (
    <div className="relative">
      <AdminTooltip content="Notifications" side="bottom">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={cn(
            "relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors border",
            isDark ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white" : "bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:text-gray-900"
          )}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[hsl(330,80%,60%)] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[hsl(260,50%,4%)]">
            4
          </span>
        </motion.button>
      </AdminTooltip>

      <AnimatePresence>
        {notificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              style={{ zIndex: 9990 }}
              onClick={() => setNotificationsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute right-0 top-full mt-2 w-80 rounded-2xl border overflow-hidden",
                isDark ? "bg-[hsl(260,45%,9%)] border-white/10" : "bg-white border-black/10"
              )}
              style={{
                zIndex: 9991,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: isDark ? "0 16px 48px -8px rgba(139, 92, 246, 0.3)" : "0 16px 48px -8px rgba(139, 92, 246, 0.15)",
              }}
            >
              <div className={cn("flex items-center justify-between px-4 py-3 border-b", isDark ? "border-white/10" : "border-black/10")}>
                <h3 className="text-sm font-bold">Notifications</h3>
                <button className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn("flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-black/5")}
                  >
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", notificationColors[n.type])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{n.title}</p>
                      <p className={cn("text-xs truncate", isDark ? "text-white/50" : "text-gray-500")}>{n.desc}</p>
                      <p className={cn("text-[10px] mt-1", isDark ? "text-white/30" : "text-gray-400")}>{n.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={cn("px-4 py-2.5 border-t text-center", isDark ? "border-white/10" : "border-black/10")}>
                <Link href="/admin/notifications" className="text-xs text-[hsl(263,70%,58%)] hover:underline font-medium">View all notifications</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}