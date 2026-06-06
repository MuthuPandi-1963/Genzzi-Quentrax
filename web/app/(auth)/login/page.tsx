"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Fingerprint, Shield, Sparkles, Loader2,
  AlertCircle, CheckCircle2, Moon, Sun,
  ChevronLeft, Trophy, Star, Zap, Brain,
} from "lucide-react";
import Link from "next/link";
import SiteLogo from "../../../components/SiteLogo";

/* ═══════════════════════════════════════════════════════════
   QUENTRAX — LOGIN PAGE
   Split layout matching Register page style
   New animated neural/brain SVG illustration on the left
   ═══════════════════════════════════════════════════════════ */

/* ── seeded random (no SSR mismatch) ───────────────────── */
function sr(n: number) {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

/* ══════════════════════════════════════════════════════════
   ANIMATED NEURAL BRAIN ILLUSTRATION
   Different from Register: features a dynamic network/
   constellation brain with pulsing nodes and data streams
   ══════════════════════════════════════════════════════════ */
function NeuralIllustration({ isDark }: { isDark: boolean }) {
  const accent  = "hsl(263,70%,58%)";
  const accent2 = "hsl(180,70%,50%)";
  const accent3 = "hsl(45,95%,55%)";
  const cardBg  = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)";
  const cardBd  = isDark ? "rgba(255,255,255,0.12)" : "rgba(139,92,246,0.18)";
  const txt     = isDark ? "rgba(255,255,255,0.9)"  : "hsl(260,50%,12%)";
  const txt2    = isDark ? "rgba(255,255,255,0.45)" : "rgba(100,80,160,0.7)";
  const glowCol = isDark ? "hsl(263,70%,58%)" : "hsl(263,70%,65%)";

  /* Neural network node positions — arranged in brain-like lobes */
  const nodes = [
    // core
    { x: 210, y: 230, r: 7, col: accent  },
    { x: 210, y: 190, r: 5, col: accent2 },
    // left lobe
    { x: 152, y: 205, r: 5, col: accent  },
    { x: 140, y: 240, r: 4, col: accent2 },
    { x: 162, y: 265, r: 5, col: accent  },
    { x: 170, y: 175, r: 4, col: accent3 },
    { x: 138, y: 175, r: 3, col: accent  },
    // right lobe
    { x: 268, y: 205, r: 5, col: accent  },
    { x: 280, y: 240, r: 4, col: accent2 },
    { x: 258, y: 265, r: 5, col: accent  },
    { x: 250, y: 175, r: 4, col: accent3 },
    { x: 282, y: 175, r: 3, col: accent  },
    // top crown
    { x: 210, y: 148, r: 5, col: accent3 },
    { x: 182, y: 158, r: 3, col: accent2 },
    { x: 238, y: 158, r: 3, col: accent2 },
    // bottom
    { x: 210, y: 300, r: 4, col: accent2 },
    { x: 185, y: 290, r: 3, col: accent  },
    { x: 235, y: 290, r: 3, col: accent  },
  ];

  /* Synaptic connections between nodes */
  const edges = [
    [0,1],[0,2],[0,7],[0,15],
    [1,12],[1,13],[1,14],
    [2,3],[2,5],[2,13],
    [3,4],[3,6],
    [4,16],[5,6],[5,13],
    [7,8],[7,10],[7,14],
    [8,9],[8,11],
    [9,17],[10,11],[10,14],
    [12,13],[12,14],
    [15,16],[15,17],
    [2,7],[4,9],
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" style={{ minHeight: 480 }}>

      {/* ambient blobs */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, top: "8%", left: "5%",
          background: `radial-gradient(circle, ${isDark ? "hsl(263 70% 40%/0.3)" : "hsl(263 70% 70%/0.12)"} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 220, height: 220, bottom: "3%", right: "3%",
          background: `radial-gradient(circle, ${isDark ? "hsl(180 70% 35%/0.25)" : "hsl(180 70% 55%/0.1)"} 0%, transparent 70%)` }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox="0 0 420 480" width="100%"
        style={{ maxWidth: 420, filter: isDark
          ? "drop-shadow(0 0 36px hsl(263 70% 58%/0.2))"
          : "drop-shadow(0 4px 28px rgba(139,92,246,0.1))" }}
        aria-label="Neural network brain illustration">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={isDark ? "#7c3aed" : "#a78bfa"} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={isDark ? "#4c1d95" : "#7c3aed"} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="coreGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={isDark ? "#0d9488" : "#2dd4bf"} stopOpacity="0.35"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <filter id="ng">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="ngs">
            <feGaussianBlur stdDeviation="7" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="blur4">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>

        {/* ── Brain outline (organic lobe shape) ── */}
        <motion.g
          animate={{ rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" } as any}
          style={{ originX: "210px", originY: "225px" } as any}
        >
          {/* bg glow fill */}
          <ellipse cx="210" cy="228" rx="105" ry="95" fill="url(#coreGlow)" filter="url(#ngs)" opacity="0.7"/>
          <ellipse cx="210" cy="228" rx="70"  ry="75" fill="url(#coreGlow2)" filter="url(#blur4)" opacity="0.5"/>

          {/* Left lobe outline */}
          <path d="M210 148 Q178 142 158 158 Q130 175 128 205 Q126 235 142 258 Q158 278 185 288 Q200 294 210 292"
            fill="none" stroke={glowCol} strokeWidth="1.8" opacity="0.5" strokeLinecap="round"
          />
          {/* Right lobe outline */}
          <path d="M210 148 Q242 142 262 158 Q290 175 292 205 Q294 235 278 258 Q262 278 235 288 Q220 294 210 292"
            fill="none" stroke={glowCol} strokeWidth="1.8" opacity="0.5" strokeLinecap="round"
          />
          {/* corpus callosum divider */}
          <path d="M200 225 Q205 215 210 213 Q215 215 220 225"
            fill="none" stroke={glowCol} strokeWidth="1.2" opacity="0.35"
          />

          {/* ── Synapse edges (drawn first, behind nodes) ── */}
          {edges.map(([a, b], i) => (
            <motion.line key={i}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke={i % 3 === 0 ? accent : i % 3 === 1 ? accent2 : glowCol}
              strokeWidth="0.9"
              animate={{ opacity: [0.1, 0.45, 0.1] }}
              transition={{ duration: 2.5 + (i % 5) * 0.6, repeat: Infinity, delay: (i % 7) * 0.35 } as any}
            />
          ))}

          {/* ── Data pulse travelling along edges ── */}
          {edges.slice(0, 10).map(([a, b], i) => (
            <motion.circle key={`pulse-${i}`} r="2.5"
              fill={i % 2 === 0 ? accent : accent2}
              filter="url(#ng)"
              animate={{
                cx: [nodes[a].x, nodes[b].x],
                cy: [nodes[a].y, nodes[b].y],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.4 + i * 0.25, repeat: Infinity, delay: i * 0.55, ease: "easeInOut" } as any}
            />
          ))}

          {/* ── Neural nodes ── */}
          {nodes.map((n, i) => (
            <motion.g key={i}>
              {/* halo */}
              <motion.circle cx={n.x} cy={n.y} r={n.r * 2.2} fill={n.col} opacity="0.12"
                animate={{ r: [n.r * 2, n.r * 3, n.r * 2], opacity: [0.08, 0.22, 0.08] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 } as any}
              />
              {/* core */}
              <motion.circle cx={n.x} cy={n.y} r={n.r} fill={n.col}
                filter="url(#ng)"
                animate={{ r: [n.r * 0.85, n.r * 1.15, n.r * 0.85], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 1.8 + i * 0.25, repeat: Infinity, delay: i * 0.18 } as any}
              />
            </motion.g>
          ))}
        </motion.g>

        {/* ── WELCOME BACK card (centre-bottom) ── */}
        <motion.g
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" } as any}
        >
          <rect x="120" y="305" width="180" height="100" rx="16"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <rect x="120" y="305" width="180" height="32" rx="16" fill={accent} opacity="0.85"/>
          <rect x="120" y="320" width="180" height="17" fill={accent} opacity="0.85"/>
          <text x="140" y="326" fontSize="10" fontWeight="700" fill="white" fontFamily="system-ui">🔐 SECURE LOGIN</text>
          {/* lock icon row */}
          <text x="155" y="355" fontSize="10" fill={txt2} fontFamily="system-ui" textAnchor="middle">Biometric Ready</text>
          <text x="210" y="350" fontSize="18" textAnchor="middle">🛡️</text>
          <text x="265" y="355" fontSize="10" fill={txt2} fontFamily="system-ui" textAnchor="middle">2FA Active</text>
          {/* bar */}
          <rect x="138" y="366" width="144" height="5" rx="2.5" fill={isDark ? "rgba(255,255,255,0.08)" : "rgba(139,92,246,0.1)"}/>
          <motion.rect x="138" y="366" width="0" height="5" rx="2.5" fill={accent}
            animate={{ width: [0, 144, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" } as any}
          />
          <text x="210" y="390" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">Identity verification in progress…</text>
        </motion.g>

        {/* ── STATS card (top-left) ── */}
        <motion.g
          animate={{ y: [0, -9, 0], rotate: [-2, 0.5, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 } as any}
          style={{ originX: "85px", originY: "108px" } as any}
        >
          <rect x="25" y="75" width="128" height="130" rx="14"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <rect x="25" y="75" width="128" height="30" rx="14" fill={accent2} opacity="0.8"/>
          <rect x="25" y="90" width="128" height="15" fill={accent2} opacity="0.8"/>
          <text x="45" y="96" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">⚡ YOUR PROGRESS</text>
          {[
            { label: "Total XP",    val: "42,810", col: accent3 },
            { label: "Quizzes",     val: "318",    col: accent  },
            { label: "Win Rate",    val: "76%",    col: accent2 },
            { label: "Best Streak", val: "34d 🔥", col: "#f97316" },
          ].map(({ label, val, col }, i) => (
            <g key={i}>
              <text x="35"  y={116+i*24} fontSize="8"  fill={txt2} fontFamily="system-ui">{label}</text>
              <text x="143" y={116+i*24} fontSize="9"  fill={col}  fontFamily="system-ui" textAnchor="end" fontWeight="700">{val}</text>
              <line x1="35" y1={120+i*24} x2="143" y2={120+i*24} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} strokeWidth="0.8"/>
            </g>
          ))}
        </motion.g>

        {/* ── RANK card (top-right) ── */}
        <motion.g
          animate={{ y: [0, -11, 0], rotate: [2, -0.5, 2] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 } as any}
          style={{ originX: "340px", originY: "120px" } as any}
        >
          <rect x="268" y="65" width="122" height="110" rx="14"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="329" y="105" fontSize="28" textAnchor="middle">🏆</text>
          <text x="329" y="126" fontSize="20" fontWeight="900" fill={accent3} textAnchor="middle" fontFamily="system-ui">ELITE</text>
          <text x="329" y="141" fontSize="8"  fill={txt2} textAnchor="middle" fontFamily="system-ui">RANK · TOP 3%</text>
          <rect x="284" y="150" width="90" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.1)" : "rgba(139,92,246,0.1)"}/>
          <motion.rect x="284" y="150" width="0" height="4" rx="2" fill={accent3}
            animate={{ width: [0, 82] }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" } as any}
          />
          <text x="329" y="167" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">4,210 XP to LEGEND</text>
        </motion.g>

        {/* ── STREAK mini (bottom-left) ── */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2 } as any}
        >
          <rect x="28" y="382" width="92" height="70" rx="12"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="74" y="412" fontSize="20" textAnchor="middle">🔥</text>
          <text x="74" y="430" fontSize="17" fontWeight="900" fill="#f97316" textAnchor="middle" fontFamily="system-ui">34</text>
          <text x="74" y="443" fontSize="8"  fill={txt2} textAnchor="middle" fontFamily="system-ui">DAY STREAK</text>
        </motion.g>

        {/* ── ACCURACY mini (bottom-right) ── */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 } as any}
        >
          <rect x="300" y="382" width="92" height="70" rx="12"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="346" y="408" fontSize="15" fontWeight="900" fill={accent} textAnchor="middle" fontFamily="system-ui">97%</text>
          <text x="346" y="422" fontSize="8"  fill={txt2} textAnchor="middle" fontFamily="system-ui">ACCURACY</text>
          <rect x="314" y="430" width="64" height="4" rx="2" fill={isDark ? "rgba(255,255,255,0.1)" : "rgba(139,92,246,0.1)"}/>
          <motion.rect x="314" y="430" width="0" height="4" rx="2" fill={accent}
            animate={{ width: [0, 62] }}
            transition={{ duration: 1.3, delay: 0.9, ease: "easeOut" } as any}
          />
          <text x="346" y="447" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">Master Rank</text>
        </motion.g>

        {/* ── Orbiting particles around the brain ── */}
        {[0,1,2,3,4].map(i => {
          const angle = (i / 5) * Math.PI * 2;
          const rx = 135, ry = 118;
          const col = [accent, accent2, accent3, accent, accent2][i];
          return (
            <motion.circle key={i} r={2.5 + sr(i)*2} fill={col} opacity="0.5" filter="url(#ng)"
              animate={{
                cx: [
                  210 + Math.cos(angle) * rx,
                  210 + Math.cos(angle + (Math.PI*2/5)) * rx,
                  210 + Math.cos(angle + (Math.PI*4/5)) * rx,
                  210 + Math.cos(angle + (Math.PI*6/5)) * rx,
                  210 + Math.cos(angle + (Math.PI*8/5)) * rx,
                  210 + Math.cos(angle) * rx,
                ],
                cy: [
                  228 + Math.sin(angle) * ry,
                  228 + Math.sin(angle + (Math.PI*2/5)) * ry,
                  228 + Math.sin(angle + (Math.PI*4/5)) * ry,
                  228 + Math.sin(angle + (Math.PI*6/5)) * ry,
                  228 + Math.sin(angle + (Math.PI*8/5)) * ry,
                  228 + Math.sin(angle) * ry,
                ],
                opacity: [0.25, 0.7, 0.25, 0.7, 0.25, 0.25],
              }}
              transition={{ duration: 10 + i * 1.5, repeat: Infinity, ease: "linear", delay: i * 0.9 } as any}
            />
          );
        })}

        {/* ── dashed connection lines ── */}
        {[[89, 210, 120, 305],[340, 175, 300, 305]].map(([x1,y1,x2,y2],i)=>(
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accent} strokeWidth="0.8" strokeDasharray="4 5" opacity="0.25"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" } as any}
          />
        ))}
      </svg>

      {/* floating micro-badges */}
      {[
        { label: "🔓 Unlocked",   top: "10%", left: "60%",  color: accent2,  delay: 0   },
        { label: "⚡ Fast Login",  top: "55%", left: "2%",   color: accent,   delay: 1.4 },
        { label: "🎯 97% Win",    top: "84%", left: "58%",  color: accent3,  delay: 2.4 },
      ].map(({ label, top, left, color, delay }) => (
        <motion.div key={label} className="absolute pointer-events-none" style={{ top, left }}
          animate={{ y: [0, -10, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay } as any}>
          <div className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide"
            style={{ background: `${color}22`, border: `1px solid ${color}55`, color,
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const [theme, setTheme]           = useState<"dark"|"light">("dark");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");
  const [focusedField, setFocusedField] = useState<string|null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showMfa, setShowMfa]       = useState(false);
  const [mfaCode, setMfaCode]       = useState("");
  const [shake, setShake]           = useState(false);

  const isDark = theme === "dark";

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      left:     `${sr(i+1)*100}%`,
      top:      `${sr(i+51)*100}%`,
      size:     sr(i+101)*4+2,
      xOff:     sr(i+151)*24-12,
      duration: sr(i+201)*8+5,
      delay:    sr(i+251)*4,
      teal:     i%5===0,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    if (email === "demo@quentrax.com" || loginAttempts >= 1) {
      setShowMfa(true);
      setIsLoading(false);
      return;
    }
    if (email === "error@quentrax.com") {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError("Invalid credentials. Please check your email and password.");
      setLoginAttempts(p => p + 1);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  /* shared input class */
  const inputCls = (field: string, extra = "") =>
    [
      "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 border",
      isDark
        ? `bg-white/5 text-white placeholder-white/25 ${
            focusedField===field
              ? "border-[hsl(263,70%,58%)] shadow-[0_0_0_3px_hsl(263,70%,58%/0.15)]"
              : "border-white/10 hover:border-white/20"
          }`
        : `bg-white text-gray-800 placeholder-gray-400 ${
            focusedField===field
              ? "border-[hsl(263,70%,58%)] shadow-[0_0_0_3px_hsl(263,70%,58%/0.12)]"
              : "border-gray-200 hover:border-gray-300"
          }`,
      extra,
    ].join(" ");

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-[hsl(260,50%,4%)] text-white" : "bg-[hsl(260,20%,96%)] text-[hsl(260,50%,10%)]"
      }`}
      style={{
        backgroundImage: isDark
          ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 20%/0.3),transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(180 80% 25%/0.15),transparent),
             radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30%/0.1),transparent)`
          : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60%/0.08),transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(180 70% 55%/0.05),transparent)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: p.size, height: p.size, left: p.left, top: p.top,
              background: p.teal ? "hsl(180,70%,50%)" : "hsl(263,70%,58%)" }}
            animate={{ y:[0,-38,0], x:[0,p.xOff,0], opacity:[0,0.6,0], scale:[0.5,1.2,0.5] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease:"easeInOut" }}
          />
        ))}
      </div>

      {/* Theme toggle */}
      <motion.button
        onClick={() => setTheme(t => t==="dark"?"light":"dark")}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl border transition-all ${
          isDark ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
                 : "bg-white/80 hover:bg-white text-gray-700 border-black/10 shadow-lg"
        }`}
        whileHover={{ scale:1.1, rotate:180 }} whileTap={{ scale:0.9 }}
        transition={{ duration:0.3 }}
      >
        <AnimatePresence mode="wait">
          {isDark
            ? <motion.div key="moon" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.2}}><Moon className="w-5 h-5"/></motion.div>
            : <motion.div key="sun"  initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.2}}><Sun  className="w-5 h-5"/></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Back link */}
      <motion.div className="fixed top-6 left-6 z-50"
        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}>
        <Link href="/" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isDark ? "text-white/60 hover:text-white hover:bg-white/10"
                 : "text-gray-500 hover:text-gray-800 hover:bg-black/5"
        }`}>
          <ChevronLeft className="w-4 h-4"/>Back to Home
        </Link>
      </motion.div>

      {/* ══ SPLIT LAYOUT ══════════════════════════════════════ */}
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ── LEFT: Illustration panel ── */}
        <motion.div
          className={`hidden lg:flex flex-col justify-center items-center w-[52%] relative px-12 py-24 ${
            isDark ? "border-r border-white/5" : "border-r border-black/5"
          }`}
          initial={{ opacity:0, x:-60 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8, ease:[0,0,0.2,1] }}
        >
          {/* headline overlay */}
          <div className="absolute top-28 left-12 right-12 z-10">
            <motion.div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${
                isDark ? "bg-white/8 border border-white/15 text-white/80"
                       : "bg-white/70 border border-black/10 text-gray-700"
              }`}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            >
              <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:"linear" }}>
                <Sparkles className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
              </motion.div>
              Your neural network awaits
            </motion.div>

            <motion.h2 className="text-4xl font-black leading-tight mb-3"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}>
              <span className="text-gradient">Pick up where</span>
              <br/>
              <span className={isDark ? "text-white/80" : "text-gray-700"}>you left off.</span>
              <br/>
              <span className="text-gradient">Dominate again.</span>
            </motion.h2>

            <motion.p className={`text-sm leading-relaxed max-w-xs ${isDark ? "text-white/50" : "text-gray-500"}`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}>
              Your rank, streak, and progress are waiting. Sign back in and keep climbing the leaderboard.
            </motion.p>
          </div>

          {/* illustration */}
          <div className="w-full mt-36">
            <NeuralIllustration isDark={isDark}/>
          </div>

          {/* bottom trust row */}
          <motion.div
            className="absolute bottom-10 left-12 right-12 flex items-center justify-center gap-6"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}>
            {[
              { icon: Shield, label: "Genzzi Secured"  },
              { icon: Trophy, label: "50k+ Quizzes"    },
              { icon: Star,   label: "4.9 Rating"      },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? "text-white/40" : "text-gray-400"}`}>
                <Icon className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Form panel ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 lg:py-12">
          <motion.div
            className={`w-full max-w-md ${
              isDark
                ? "bg-white/[0.04] backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[0_8px_64px_rgba(0,0,0,0.5)]"
                : "bg-white/90 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-2xl"
            } p-8`}
            initial={{ opacity:0, y:40, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ duration:0.65, ease:[0,0,0.2,1], delay:0.15 }}
          >
            {/* Logo + heading */}
            <motion.div className="text-center mb-6"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
              <motion.div className="w-14 h-14 mx-auto mb-3 relative"
                animate={{ rotate:[0,6,-6,0] }} transition={{ duration:7, repeat:Infinity }}>
                <SiteLogo variantIndex={0} className="w-full h-full object-contain drop-shadow-2xl"/>
                {isDark && (
                  <motion.div className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow:"0 0 24px 6px hsl(263 70% 58%/0.35)" }}
                    animate={{ opacity:[0.4,0.9,0.4] }} transition={{ duration:3, repeat:Infinity }}
                  />
                )}
              </motion.div>
              <h1 className="text-2xl font-black tracking-tight mb-1">
                <span className="text-gradient">Welcome Back</span>
              </h1>
              <p className={`text-sm ${isDark ? "text-white/45" : "text-gray-500"}`}>
                Sign in and continue your journey
              </p>
            </motion.div>

            {/* Genzzi badge */}
            <motion.div
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-5 ${
                isDark ? "bg-white/5 border border-white/10 text-white/60"
                       : "bg-black/4 border border-black/8 text-gray-600"
              }`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
              <Fingerprint className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
              Secured by Genzzi Identity Protocol v2.1
            </motion.div>

            {/* ── FORMS ── */}
            <AnimatePresence mode="wait">

              {/* LOGIN FORM */}
              {!showMfa && (
                <motion.form key="login-form" onSubmit={handleSubmit} className="space-y-4"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-40 }} transition={{ duration:0.35 }}>

                  {/* error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className={`flex items-start gap-2.5 p-3.5 rounded-xl ${
                          isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"
                        }`}
                        initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                        exit={{ opacity:0, height:0 }}>
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"/>
                        <div className="flex-1">
                          <p className={`text-xs font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
                          {loginAttempts >= 1 && (
                            <p className={`text-xs mt-0.5 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                              {5 - loginAttempts} attempts remaining before account lock.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* email */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focusedField==="email" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                        onFocus={()=>setFocusedField("email")} onBlur={()=>setFocusedField(null)}
                        placeholder="you@example.com"
                        className={`${inputCls("email","pl-10")} ${shake ? "animate-shake" : ""}`} required/>
                    </div>
                  </motion.div>

                  {/* password */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focusedField==="password" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input type={showPassword?"text":"password"} value={password}
                        onChange={e=>setPassword(e.target.value)}
                        onFocus={()=>setFocusedField("password")} onBlur={()=>setFocusedField(null)}
                        placeholder="Enter your password"
                        className={`${inputCls("password","pl-10 pr-10")} ${shake ? "animate-shake" : ""}`} required/>
                      <button type="button" onClick={()=>setShowPassword(s=>!s)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </motion.div>

                  {/* remember + forgot */}
                  <motion.div className="flex items-center justify-between"
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <motion.div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          rememberMe
                            ? "bg-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]"
                            : isDark ? "border-white/20 group-hover:border-white/40" : "border-gray-300 group-hover:border-gray-400"
                        }`}
                        onClick={() => setRememberMe(r=>!r)}
                        whileTap={{ scale:0.85 }}>
                        <AnimatePresence>
                          {rememberMe && (
                            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                              transition={{ type:"spring", stiffness:500 }}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white"/>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <span className={`text-xs ${isDark ? "text-white/55" : "text-gray-500"}`}>Remember me</span>
                    </label>
                    <Link href="/forgot-password"
                      className={`text-xs font-semibold hover:underline transition-colors ${
                        isDark ? "text-[hsl(263,70%,58%)]" : "text-[hsl(263,70%,50%)]"
                      }`}>
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* submit */}
                  <motion.button type="submit" disabled={isLoading}
                    className="w-full gradient-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                    whileHover={{ scale:1.02, boxShadow:"0 8px 32px -8px hsl(263 70% 58%/0.55)" }}
                    whileTap={{ scale:0.97 }}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin"/>Signing in…</>
                    ) : (
                      <>Sign In<motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.2, repeat:Infinity }}><ArrowRight className="w-4 h-4"/></motion.div></>
                    )}
                  </motion.button>

                  {/* divider */}
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? "border-white/8" : "border-gray-200"}`}/>
                    </div>
                    <div className="relative flex justify-center">
                      <span className={`px-3 text-xs ${isDark ? "bg-[hsl(260,50%,5%)] text-white/30" : "bg-white text-gray-400"}`}>or</span>
                    </div>
                  </div>

                  {/* Genzzi SSO */}
                  <motion.button type="button"
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                      isDark ? "border-white/15 text-white hover:bg-white/8 hover:border-white/25"
                             : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
                    <Fingerprint className="w-4 h-4 text-[hsl(263,70%,58%)]"/>
                    Sign in with Genzzi
                  </motion.button>

                  {/* register link */}
                  <motion.p className={`text-center text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/register"
                      className={`font-semibold hover:underline ${isDark ? "text-[hsl(263,70%,58%)]" : "text-[hsl(263,70%,50%)]"}`}>
                      Create one
                    </Link>
                  </motion.p>
                </motion.form>
              )}

              {/* MFA FORM */}
              {showMfa && (
                <motion.form key="mfa-form" onSubmit={handleMfaSubmit} className="space-y-5"
                  initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-40 }} transition={{ duration:0.35 }}>

                  <div className="text-center">
                    <motion.div
                      className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                        isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                      }`}
                      animate={{ scale:[1, 1.1, 1] }} transition={{ duration:2, repeat:Infinity }}>
                      <Shield className="w-7 h-7 text-[hsl(263,70%,58%)]"/>
                    </motion.div>
                    <h2 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-gray-800"}`}>
                      Two-Factor Auth
                    </h2>
                    <p className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  {/* OTP inputs */}
                  <div className="flex justify-center gap-2">
                    {[0,1,2,3,4,5].map(i => (
                      <motion.input key={i} id={`mfa-${i}`} type="text" inputMode="numeric"
                        maxLength={1}
                        className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none ${
                          isDark
                            ? "bg-white/5 border-white/20 text-white focus:border-[hsl(263,70%,58%)] focus:shadow-[0_0_0_3px_hsl(263,70%,58%/0.15)]"
                            : "bg-white border-gray-200 text-gray-800 focus:border-[hsl(263,70%,58%)]"
                        }`}
                        style={{ height: 52 }}
                        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay: i * 0.07 } as any}
                        value={mfaCode[i] || ""}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g,"");
                          const chars = mfaCode.split("");
                          chars[i] = val;
                          setMfaCode(chars.join(""));
                          if (val && i < 5) document.getElementById(`mfa-${i+1}`)?.focus();
                        }}
                        onKeyDown={e => {
                          if (e.key==="Backspace" && !mfaCode[i] && i>0)
                            document.getElementById(`mfa-${i-1}`)?.focus();
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.button type="button" onClick={() => setShowMfa(false)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        isDark ? "border-white/15 text-white/70 hover:bg-white/8"
                               : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                      Back
                    </motion.button>
                    <motion.button type="submit"
                      disabled={isLoading || mfaCode.replace(/\s/g,"").length !== 6}
                      className="flex-[2] gradient-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      whileHover={{ scale:1.02, boxShadow:"0 8px 32px -8px hsl(263 70% 58%/0.55)" }}
                      whileTap={{ scale:0.97 }}>
                      {isLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin"/>Verifying…</>
                        : <><Zap className="w-4 h-4"/>Verify &amp; Sign In</>
                      }
                    </motion.button>
                  </div>

                  <p className={`text-center text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
                    Can&apos;t access your authenticator?{" "}
                    <button type="button" className="text-[hsl(263,70%,58%)] hover:underline font-semibold">
                      Use backup code
                    </button>
                  </p>
                </motion.form>
              )}

            </AnimatePresence>

            {/* footer trust */}
            <motion.div
              className={`mt-6 pt-5 border-t ${isDark ? "border-white/8" : "border-gray-200"} flex items-center justify-center gap-4`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}>
              {[
                { icon: Lock,     label:"AES-256",        col:"hsl(142,76%,45%)" },
                { icon: Shield,   label:"Genzzi",         col:"hsl(263,70%,58%)" },
                { icon: Sparkles, label:"Zero-Knowledge", col:"hsl(180,70%,50%)" },
              ].map(({ icon: Icon, label, col }) => (
                <div key={label} className="flex items-center gap-1">
                  <Icon className="w-3 h-3" style={{ color:col }}/>
                  <span className={`text-[10px] ${isDark ? "text-white/35" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}