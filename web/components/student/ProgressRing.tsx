// components/student/ProgressRing.tsx
// ── Animated SVG progress ring ─────────────────────────────────────────────

"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
  label: string;
  sublabel: string;
}

export function ProgressRing({
  percent,
  size = 110,
  stroke = 9,
  label,
  sublabel,
}: ProgressRingProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(263,70%,58%)" />
              <stop offset="100%" stopColor="hsl(330,80%,60%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-black text-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percent}%
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs mt-0.5 text-white/50">{sublabel}</p>
      </div>
    </div>
  );
}