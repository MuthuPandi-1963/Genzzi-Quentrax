"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function AdminTooltip({
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!show) return <>{children}</>;

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const GAP = 8;
    let top = 0, left = 0;
    switch (side) {
      case "right": top = rect.top + rect.height / 2; left = rect.right + GAP; break;
      case "left": top = rect.top + rect.height / 2; left = rect.left - GAP; break;
      case "top": top = rect.top - GAP; left = rect.left + rect.width / 2; break;
      case "bottom": top = rect.bottom + GAP; left = rect.left + rect.width / 2; break;
    }
    setCoords({ top, left });
  };

  const transformOrigin = {
    right: "translateY(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
  }[side];

  return (
    <div
      ref={triggerRef}
      className="relative flex items-center"
      onMouseEnter={() => { updateCoords(); setVisible(true); }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "fixed whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold pointer-events-none border shadow-lg",
              isDark ? "bg-[hsl(260,45%,9%)] border-white/15 text-white" : "bg-white border-black/10 text-[hsl(260,40%,10%)]"
            )}
            style={{
              zIndex: 9999,
              top: coords.top,
              left: coords.left,
              transform: transformOrigin,
              boxShadow: isDark ? "0 8px 32px -4px rgba(139, 92, 246, 0.25)" : "0 8px 32px -4px rgba(139, 92, 246, 0.12)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}