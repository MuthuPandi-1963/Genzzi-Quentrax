"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  Fingerprint, Shield, Sparkles, Loader2, AlertCircle,
  CheckCircle2, Moon, Sun, ChevronLeft, Trophy, Star,
  Brain, Zap, Check, X,
} from "lucide-react";
import Link from "next/link";
import SiteLogo from "../../../components/SiteLogo";

/* ═══════════════════════════════════════════════════════════
   QUENTRAX — REGISTER PAGE
   Split layout: animated SVG illustration left, form right
   Dark / Light theme · Framer Motion animations throughout
   ═══════════════════════════════════════════════════════════ */

/* ── password strength ─────────────────────────────────── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

/* ── seeded random (no SSR mismatch) ───────────────────── */
function sr(n: number) {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

/* ══════════════════════════════════════════════════════════
   ANIMATED ILLUSTRATION  (pure SVG + CSS animations)
   Represents: quiz cards, leaderboard, brain, score badges
   ══════════════════════════════════════════════════════════ */
function QuentraxIllustration({ isDark }: { isDark: boolean }) {
  const accent   = "hsl(263,70%,58%)";
  const accent2  = "hsl(330,80%,60%)";
  const accent3  = "hsl(45,95%,55%)";
  const cardBg   = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)";
  const cardBd   = isDark ? "rgba(255,255,255,0.12)" : "rgba(139,92,246,0.18)";
  const txt      = isDark ? "rgba(255,255,255,0.9)"  : "hsl(260,50%,12%)";
  const txt2     = isDark ? "rgba(255,255,255,0.45)" : "rgba(100,80,160,0.7)";
  const glowCol  = isDark ? "hsl(263,70%,58%)" : "hsl(263,70%,70%)";

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" style={{ minHeight: 480 }}>

      {/* ── ambient glow blobs ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 280, height: 280, top: "10%", left: "10%",
          background: `radial-gradient(circle, ${isDark ? "hsl(263 70% 40%/0.35)" : "hsl(263 70% 70%/0.15)"} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, bottom: "5%", right: "5%",
          background: `radial-gradient(circle, ${isDark ? "hsl(330 80%40%/0.3)" : "hsl(330 80% 65%/0.12)"} 0%, transparent 70%)` }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── SVG core illustration ── */}
      <svg
        viewBox="0 0 420 480"
        width="100%"
        style={{ maxWidth: 420, filter: isDark ? "drop-shadow(0 0 32px hsl(263 70% 58%/0.22))" : "drop-shadow(0 4px 24px rgba(139,92,246,0.12))" }}
        aria-label="Quentrax quiz platform illustration"
      >
        <defs>
          <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={isDark ? "#7c3aed" : "#a78bfa"} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={isDark ? "#4c1d95" : "#7c3aed"} stopOpacity="0.05"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Brain silhouette (simplified geometric) ── */}
        <motion.g
          style={{ originX: "210px", originY: "240px" } as any}
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" } as any}
        >
          {/* Brain glow bg */}
          <ellipse cx="210" cy="225" rx="115" ry="105" fill="url(#brainGrad)" filter="url(#softglow)"/>

          {/* Left lobe */}
          <path
            d="M130 220 Q118 190 135 168 Q152 148 175 152 Q165 175 168 200 Q165 225 155 238 Q140 248 130 240 Z"
            fill="none" stroke={glowCol} strokeWidth="2" opacity="0.7" filter="url(#glow)"
          />
          {/* Right lobe */}
          <path
            d="M290 220 Q302 190 285 168 Q268 148 245 152 Q255 175 252 200 Q255 225 265 238 Q280 248 290 240 Z"
            fill="none" stroke={glowCol} strokeWidth="2" opacity="0.7" filter="url(#glow)"
          />
          {/* Centre bridge */}
          <path
            d="M175 152 Q195 135 210 138 Q225 135 245 152"
            fill="none" stroke={glowCol} strokeWidth="1.5" opacity="0.5"
          />
          <path
            d="M155 238 Q175 260 210 262 Q245 260 265 238"
            fill="none" stroke={glowCol} strokeWidth="1.5" opacity="0.5"
          />
          {/* Neural spark lines */}
          {[[160,188,185,175],[195,160,210,178],[225,165,210,178],[240,190,215,200],[175,220,200,212],[245,222,215,210]].map(([x1,y1,x2,y2],i) => (
            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i%2===0 ? accent : accent2} strokeWidth="1" opacity="0.5"
              animate={{ opacity: [0.15, 0.7, 0.15] }}
              transition={{ duration: 2 + i*0.4, repeat: Infinity, delay: i*0.3 } as any}
            />
          ))}
          {/* Synapse dots */}
          {[[185,175],[210,178],[215,200],[200,212],[210,200]].map(([cx,cy],i) => (
            <motion.circle key={i} cx={cx} cy={cy} r="3" fill={i%2===0 ? accent : accent3}
              animate={{ r: [2.5, 4, 2.5], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5+i*0.3, repeat: Infinity, delay: i*0.25 } as any}
            />
          ))}
        </motion.g>

        {/* ── MAIN Quiz Card (centre-bottom) ── */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" } as any}
        >
          <rect x="115" y="295" width="190" height="115" rx="16"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          {/* Card header bar */}
          <rect x="115" y="295" width="190" height="34" rx="16" fill={accent} opacity="0.85"/>
          <rect x="115" y="313" width="190" height="16" fill={accent} opacity="0.85"/>
          {/* Brain icon in header */}
          <text x="135" y="318" fontSize="13" fill="white" opacity="0.9">🧠</text>
          <text x="155" y="318" fontSize="10" fontWeight="700" fill="white" fontFamily="system-ui">QUENTRAX QUIZ</text>
          {/* Question text lines */}
          <rect x="130" y="342" width="120" height="7" rx="3" fill={txt2} opacity="0.5"/>
          <rect x="130" y="354" width="90" height="7" rx="3" fill={txt2} opacity="0.35"/>
          {/* Answer options */}
          {[0,1].map(row => [0,1].map(col => {
            const x = 128 + col * 97;
            const y = 368 + row * 0;
            const correct = row===0 && col===0;
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={368} width="82" height="26" rx="6"
                  fill={correct ? `${accent}22` : isDark ? "rgba(255,255,255,0.04)" : "rgba(139,92,246,0.06)"}
                  stroke={correct ? accent : cardBd} strokeWidth={correct ? 1.5 : 0.8}/>
                <text x={x+41} y={384} fontSize="9" fill={correct ? accent : txt2}
                  textAnchor="middle" fontFamily="system-ui" fontWeight={correct?"700":"400"}>
                  {[["✓ Correct","Option B"],["Option C","Option D"]][row][col]}
                </text>
              </g>
            );
          }))}
        </motion.g>

        {/* ── LEADERBOARD card (top-left) ── */}
        <motion.g
          animate={{ y: [0, -8, 0], rotate: [-2, 0, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } as any}
          style={{ originX: "85px", originY: "100px" } as any}
        >
          <rect x="28" y="75" width="130" height="140" rx="14"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <rect x="28" y="75" width="130" height="30" rx="14" fill={accent2} opacity="0.8"/>
          <rect x="28" y="89" width="130" height="16" fill={accent2} opacity="0.8"/>
          <text x="47" y="96" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">🏆 LEADERBOARD</text>
          {[
            { rank:"#1", name:"Sarah C.",  pts:"9840", col: accent3 },
            { rank:"#2", name:"Marcus J.", pts:"8721", col: isDark?"rgba(255,255,255,0.7)":"#888" },
            { rank:"#3", name:"Aisha P.",  pts:"8103", col: "#cd7f32" },
            { rank:"#4", name:"You",       pts:"7650", col: accent },
          ].map(({ rank, name, pts, col }, i) => (
            <g key={i}>
              <rect x="36" y={114+i*26} width="114" height="22" rx="5"
                fill={rank==="#4" ? `${accent}18` : "transparent"}
                stroke={rank==="#4" ? `${accent}44` : "transparent"} strokeWidth="1"/>
              <text x="42"  y={129+i*26} fontSize="9" fill={col} fontWeight="700" fontFamily="system-ui">{rank}</text>
              <text x="62"  y={129+i*26} fontSize="9" fill={txt}  fontFamily="system-ui">{name}</text>
              <text x="138" y={129+i*26} fontSize="9" fill={col}  fontFamily="system-ui" textAnchor="end">{pts}</text>
            </g>
          ))}
        </motion.g>

        {/* ── SCORE Badge (top-right) ── */}
        <motion.g
          animate={{ y: [0, -10, 0], rotate: [2, -1, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } as any}
          style={{ originX: "340px", originY: "115px" } as any}
        >
          <rect x="268" y="62" width="124" height="106" rx="14"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="330" y="98" fontSize="32" textAnchor="middle">⚡</text>
          <text x="330" y="122" fontSize="22" fontWeight="900" fill={accent3} textAnchor="middle" fontFamily="system-ui">9,840</text>
          <text x="330" y="138" fontSize="9" fill={txt2} textAnchor="middle" fontFamily="system-ui">XP THIS WEEK</text>
          {/* Stars */}
          <text x="297" y="158" fontSize="13">⭐</text>
          <text x="318" y="162" fontSize="16">⭐</text>
          <text x="341" y="158" fontSize="13">⭐</text>
          <text x="360" y="154" fontSize="11">⭐</text>
        </motion.g>

        {/* ── STREAK badge (bottom-left) ── */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 } as any}
        >
          <rect x="30" y="378" width="95" height="72" rx="12"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="77" y="410" fontSize="22" textAnchor="middle">🔥</text>
          <text x="77" y="428" fontSize="18" fontWeight="900" fill={accent2} textAnchor="middle" fontFamily="system-ui">21</text>
          <text x="77" y="441" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">DAY STREAK</text>
        </motion.g>

        {/* ── ACCURACY badge (bottom-right) ── */}
        <motion.g
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 } as any}
        >
          <rect x="298" y="378" width="95" height="72" rx="12"
            fill={cardBg} stroke={cardBd} strokeWidth="1.2"/>
          <text x="345" y="407" fontSize="16" fontWeight="900" fill={accent} textAnchor="middle" fontFamily="system-ui">94%</text>
          <text x="345" y="422" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">ACCURACY</text>
          {/* Mini bar */}
          <rect x="313" y="430" width="64" height="5" rx="2.5" fill={isDark?"rgba(255,255,255,0.1)":"rgba(139,92,246,0.12)"}/>
          <motion.rect x="313" y="430" width="60" height="5" rx="2.5" fill={accent}
            animate={{ width: [0, 60] }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" } as any}
          />
          <text x="345" y="447" fontSize="8" fill={txt2} textAnchor="middle" fontFamily="system-ui">Rank: Expert</text>
        </motion.g>

        {/* ── Orbiting dots (gamification feel) ── */}
        {[0,1,2,3,4,5].map(i => {
          const angle = (i / 6) * Math.PI * 2;
          const rx = 148, ry = 130;
          const cx = 210 + Math.cos(angle) * rx;
          const cy = 228 + Math.sin(angle) * ry;
          const size = 3 + sr(i) * 3;
          const col  = [accent, accent2, accent3, accent, accent2, accent3][i];
          return (
            <motion.circle key={i} cx={cx} cy={cy} r={size} fill={col} opacity="0.55"
              filter="url(#glow)"
              animate={{
                cx: [
                  210 + Math.cos(angle) * rx,
                  210 + Math.cos(angle + Math.PI * 2 / 3) * rx,
                  210 + Math.cos(angle + Math.PI * 4 / 3) * rx,
                  210 + Math.cos(angle) * rx,
                ],
                cy: [
                  228 + Math.sin(angle) * ry,
                  228 + Math.sin(angle + Math.PI * 2 / 3) * ry,
                  228 + Math.sin(angle + Math.PI * 4 / 3) * ry,
                  228 + Math.sin(angle) * ry,
                ],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 } as any}
            />
          );
        })}

        {/* ── connection lines between elements ── */}
        {[
          [93, 215, 130, 295],
          [330, 168, 305, 295],
        ].map(([x1,y1,x2,y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accent} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" } as any}
          />
        ))}
      </svg>

      {/* ── floating micro badges (HTML layer, easier to animate) ── */}
      {[
        { label: "+150 XP",  top: "12%", left: "62%",  color: accent3,  delay: 0    },
        { label: "LEVEL UP", top: "58%", left: "3%",   color: accent2,  delay: 1.2  },
        { label: "🏅 Badge", top: "82%", left: "60%",  color: accent,   delay: 2.1  },
      ].map(({ label, top, left, color, delay }) => (
        <motion.div
          key={label}
          className="absolute pointer-events-none"
          style={{ top, left }}
          animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay } as any}
        >
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide"
            style={{
              background: `${color}22`,
              border: `1px solid ${color}55`,
              color,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PASSWORD REQUIREMENT ROW
   ══════════════════════════════════════════════════════════ */
function Req({ met, label }: { met: boolean; label: string }) {
  return (
    <motion.div
      className="flex items-center gap-1.5"
      animate={{ opacity: met ? 1 : 0.45 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ scale: met ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {met
          ? <Check className="w-3.5 h-3.5 text-emerald-400" />
          : <X className="w-3.5 h-3.5 text-white/30" />
        }
      </motion.div>
      <span className="text-xs text-white/50">{label}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const [theme, setTheme]           = useState<"dark"|"light">("dark");
  const [step, setStep]             = useState<1|2>(1);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCf, setShowCf]         = useState(false);
  const [agreed, setAgreed]         = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");
  const [focused, setFocused]       = useState<string|null>(null);
  const [username, setUsername]     = useState("");
  const [role, setRole]             = useState<"learner"|"educator"|"">(""); 

  const isDark = theme === "dark";
  const strength = getStrength(password);
  const pwMatch  = confirm.length > 0 && password === confirm;

  /* particles */
  const particles = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      left:     `${sr(i+1)*100}%`,
      top:      `${sr(i+51)*100}%`,
      size:     sr(i+101)*4+2,
      xOff:     sr(i+151)*24-12,
      duration: sr(i+201)*8+5,
      delay:    sr(i+251)*4,
      gold:     i%6===0,
    })), []);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    if (strength < 2) { setError("Password is too weak."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Please choose a username."); return; }
    if (!role) { setError("Please select your role."); return; }
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  /* shared input class */
  const inputCls = (field: string, extra = "") =>
    [
      "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 border",
      isDark
        ? `bg-white/5 text-white placeholder-white/25 ${
            focused===field
              ? "border-[hsl(263,70%,58%)] shadow-[0_0_0_3px_hsl(263,70%,58%/0.15)]"
              : "border-white/10 hover:border-white/20"
          }`
        : `bg-white text-gray-800 placeholder-gray-400 ${
            focused===field
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
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 30%/0.15),transparent),
             radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30%/0.1),transparent)`
          : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60%/0.08),transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 60%/0.05),transparent)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: p.size, height: p.size, left: p.left, top: p.top,
              background: p.gold ? "hsl(45,95%,55%)" : "hsl(263,70%,58%)",
            }}
            animate={{ y:[0,-38,0], x:[0,p.xOff,0], opacity:[0,0.65,0], scale:[0.5,1.2,0.5] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease:"easeInOut" }}
          />
        ))}
      </div>

      {/* theme toggle */}
      <motion.button
        onClick={() => setTheme(t => t==="dark"?"light":"dark")}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl border transition-all ${
          isDark
            ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
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

      {/* back link */}
      <motion.div className="fixed top-6 left-6 z-50"
        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}>
        <Link href="/" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-black/5"
        }`}>
          <ChevronLeft className="w-4 h-4"/>
          Back to Home
        </Link>
      </motion.div>

      {/* ══ SPLIT LAYOUT ══════════════════════════════════════ */}
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ── LEFT: Illustration panel ── */}
        <motion.div
          className={`hidden lg:flex flex-col justify-center items-center w-[52%] relative px-12 py-24 ${
            isDark
              ? "border-r border-white/5"
              : "border-r border-black/5"
          }`}
          initial={{ opacity:0, x:-60 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8, ease:[0,0,0.2,1] }}
        >
          {/* headline overlay */}
          <div className="absolute top-28 left-12 right-12 z-10">
            <motion.div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${
                isDark ? "bg-white/8 border border-white/15 text-white/80" : "bg-white/70 border border-black/10 text-gray-700"
              }`}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            >
              <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:"linear" }}>
                <Sparkles className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
              </motion.div>
              Join 10,000+ learners already competing
            </motion.div>

            <motion.h2
              className="text-4xl font-black leading-tight mb-3"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
            >
              <span className="text-gradient">Quiz smarter.</span>
              <br />
              <span className={isDark ? "text-white/80" : "text-gray-700"}>Compete harder.</span>
              <br />
              <span className="text-gradient">Rank higher.</span>
            </motion.h2>

            <motion.p
              className={`text-sm leading-relaxed max-w-xs ${isDark ? "text-white/50" : "text-gray-500"}`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}
            >
              Create your free Quentrax account and start competing across 500+ quiz categories today.
            </motion.p>
          </div>

          {/* illustration */}
          <div className="w-full mt-36">
            <QuentraxIllustration isDark={isDark} />
          </div>

          {/* bottom trust row */}
          <motion.div
            className="absolute bottom-10 left-12 right-12 flex items-center justify-center gap-6"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}
          >
            {[
              { icon: Shield,  label: "Genzzi Secured" },
              { icon: Trophy,  label: "50k+ Quizzes" },
              { icon: Star,    label: "4.9 Rating" },
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
                <span className="text-gradient">Create Account</span>
              </h1>
              <p className={`text-sm ${isDark ? "text-white/45" : "text-gray-500"}`}>
                Start your quiz journey today — free forever
              </p>
            </motion.div>

            {/* Step indicator */}
            <motion.div className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
              {[1,2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <motion.div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      step > s
                        ? "bg-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)] text-white"
                        : step === s
                        ? "border-[hsl(263,70%,58%)] text-[hsl(263,70%,58%)] bg-transparent"
                        : isDark ? "border-white/20 text-white/30" : "border-gray-300 text-gray-400"
                    }`}
                    animate={{ scale: step === s ? [1, 1.12, 1] : 1 }}
                    transition={{ duration: 1.5, repeat: step === s ? Infinity : 0 }}
                  >
                    {step > s ? <Check className="w-3.5 h-3.5"/> : s}
                  </motion.div>
                  {s < 2 && (
                    <motion.div
                      className="w-12 h-0.5 rounded-full"
                      style={{ background: step > 1 ? "hsl(263,70%,58%)" : isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb" }}
                      animate={{ scaleX: step > 1 ? 1 : 0.4 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Genzzi badge */}
            <motion.div
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mb-5 ${
                isDark ? "bg-white/5 border border-white/10 text-white/60" : "bg-black/4 border border-black/8 text-gray-600"
              }`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }}
            >
              <Fingerprint className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
              Secured by Genzzi Identity Protocol v2.1
            </motion.div>

            {/* ── FORMS ── */}
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.form key="step1" onSubmit={handleStep1} className="space-y-4"
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
                        <p className={`text-xs font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* full name */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focused==="name" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input
                        type="text" value={name} onChange={e=>setName(e.target.value)}
                        onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}
                        placeholder="Jane Smith"
                        className={inputCls("name","pl-10")} required
                      />
                    </div>
                  </motion.div>

                  {/* email */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focused==="email" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input
                        type="email" value={email} onChange={e=>setEmail(e.target.value)}
                        onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
                        placeholder="you@example.com"
                        className={inputCls("email","pl-10")} required
                      />
                    </div>
                  </motion.div>

                  {/* password */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focused==="pw" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input
                        type={showPw?"text":"password"} value={password}
                        onChange={e=>setPassword(e.target.value)}
                        onFocus={()=>setFocused("pw")} onBlur={()=>setFocused(null)}
                        placeholder="Create a strong password"
                        className={inputCls("pw","pl-10 pr-10")} required
                      />
                      <button type="button" onClick={()=>setShowPw(s=>!s)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
                        {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>

                    {/* strength bar */}
                    {password.length > 0 && (
                      <motion.div className="mt-2 space-y-1.5"
                        initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}>
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <motion.div key={i} className="h-1 flex-1 rounded-full overflow-hidden"
                              style={{ background: isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb" }}>
                              <motion.div className="h-full rounded-full"
                                style={{ background: strengthColor[strength] }}
                                animate={{ width: strength >= i ? "100%" : "0%" }}
                                transition={{ duration: 0.3, delay: (i-1)*0.05 }}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                            <Req met={password.length >= 8}    label="8+ characters"/>
                            <Req met={/[A-Z]/.test(password)}  label="Uppercase letter"/>
                            <Req met={/[0-9]/.test(password)}  label="Number"/>
                            <Req met={/[^A-Za-z0-9]/.test(password)} label="Special character"/>
                          </div>
                          <motion.span className="text-xs font-bold ml-2"
                            style={{ color: strengthColor[strength] }}
                            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.4 }}>
                            {strengthLabel[strength]}
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* confirm password */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focused==="cf"
                          ? pwMatch ? "text-emerald-400" : "text-[hsl(263,70%,58%)]"
                          : isDark ? "text-white/25" : "text-gray-400"
                      }`}/>
                      <input
                        type={showCf?"text":"password"} value={confirm}
                        onChange={e=>setConfirm(e.target.value)}
                        onFocus={()=>setFocused("cf")} onBlur={()=>setFocused(null)}
                        placeholder="Re-enter your password"
                        className={[
                          inputCls("cf","pl-10 pr-10"),
                          confirm.length > 0 && (pwMatch
                            ? "!border-emerald-500/60"
                            : "!border-red-500/50"),
                        ].join(" ")}
                        required
                      />
                      <button type="button" onClick={()=>setShowCf(s=>!s)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
                        {showCf ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                      {/* match indicator */}
                      <AnimatePresence>
                        {confirm.length > 0 && (
                          <motion.div className="absolute right-10 top-1/2 -translate-y-1/2"
                            initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0 }}>
                            {pwMatch
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
                              : <AlertCircle className="w-4 h-4 text-red-400"/>
                            }
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* next button */}
                  <motion.button type="submit"
                    className="w-full gradient-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2"
                    whileHover={{ scale:1.02, boxShadow:"0 8px 32px -8px hsl(263 70% 58%/0.55)" }}
                    whileTap={{ scale:0.97 }}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
                    Continue
                    <motion.div animate={{ x:[0,4,0] }} transition={{ duration:1.2, repeat:Infinity }}>
                      <ArrowRight className="w-4 h-4"/>
                    </motion.div>
                  </motion.button>

                  {/* divider */}
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? "border-white/8" : "border-gray-200"}`}/>
                    </div>
                    <div className="relative flex justify-center">
                      <span className={`px-3 text-xs ${isDark ? "bg-[hsl(260,50%,5%)] text-white/30" : "bg-white text-gray-400"}`}>
                        or
                      </span>
                    </div>
                  </div>

                  {/* Genzzi SSO */}
                  <motion.button type="button"
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                      isDark
                        ? "border-white/15 text-white hover:bg-white/8 hover:border-white/25"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
                    <Fingerprint className="w-4 h-4 text-[hsl(263,70%,58%)]"/>
                    Sign up with Genzzi
                  </motion.button>

                  {/* sign-in link */}
                  <motion.p className={`text-center text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
                    Already have an account?{" "}
                    <Link href="/login"
                      className={`font-semibold hover:underline ${isDark ? "text-[hsl(263,70%,58%)]" : "text-[hsl(263,70%,50%)]"}`}>
                      Sign in
                    </Link>
                  </motion.p>
                </motion.form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.form key="step2" onSubmit={handleStep2} className="space-y-4"
                  initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
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
                        <p className={`text-xs font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* username */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
                    <label className={`block text-xs font-semibold mb-1.5 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Username
                    </label>
                    <div className="relative">
                      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        focused==="username" ? "text-[hsl(263,70%,58%)]" : isDark ? "text-white/30" : "text-gray-400"
                      }`}>@</span>
                      <input
                        type="text" value={username}
                        onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}
                        onFocus={()=>setFocused("username")} onBlur={()=>setFocused(null)}
                        placeholder="your_handle"
                        className={inputCls("username","pl-8")} required
                      />
                    </div>
                    <p className={`text-xs mt-1 ml-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                      Only lowercase letters, numbers, and underscores
                    </p>
                  </motion.div>

                  {/* role picker */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
                    <label className={`block text-xs font-semibold mb-2 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      I am a…
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { key:"learner",  icon:"🎓", title:"Learner",  desc:"Here to learn & compete" },
                        { key:"educator", icon:"📚", title:"Educator", desc:"Create quizzes & assess" },
                      ] as const).map(({ key, icon, title, desc }) => (
                        <motion.button
                          key={key} type="button"
                          onClick={() => setRole(key)}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                            role === key
                              ? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10"
                              : isDark
                              ? "border-white/10 hover:border-white/20 bg-white/3"
                              : "border-gray-200 hover:border-gray-300 bg-white/60"
                          }`}
                          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                          <span className="text-xl block mb-1">{icon}</span>
                          <span className={`block text-xs font-bold ${isDark ? "text-white/90":"text-gray-800"}`}>{title}</span>
                          <span className={`block text-[10px] ${isDark ? "text-white/40":"text-gray-500"}`}>{desc}</span>
                          {role === key && (
                            <motion.div className="absolute top-2 right-2"
                              initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:400 }}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]"/>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* interests (decorative multi-select) */}
                  <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
                    <label className={`block text-xs font-semibold mb-2 ml-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      Favourite topics <span className={isDark ? "text-white/30" : "text-gray-400"}>(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Science","Tech","History","Sports","Arts","Geo","Music","Films"].map(tag => {
                        const [sel, setSel] = useState(false);
                        return (
                          <motion.button key={tag} type="button"
                            onClick={()=>setSel(s=>!s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              sel
                                ? "bg-[hsl(263,70%,58%)]/15 border-[hsl(263,70%,58%)]/60 text-[hsl(263,70%,65%)]"
                                : isDark
                                ? "border-white/10 text-white/45 hover:border-white/20"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                            {tag}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* terms */}
                  <motion.label className="flex items-start gap-3 cursor-pointer group"
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}>
                    <motion.div
                      className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        agreed
                          ? "bg-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]"
                          : isDark ? "border-white/20 group-hover:border-white/40" : "border-gray-300 group-hover:border-gray-400"
                      }`}
                      onClick={() => setAgreed(a=>!a)}
                      whileTap={{ scale:0.85 }}>
                      <AnimatePresence>
                        {agreed && (
                          <motion.div initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
                            exit={{ scale:0 }} transition={{ type:"spring", stiffness:500 }}>
                            <Check className="w-3 h-3 text-white"/>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className={`text-xs leading-relaxed ${isDark ? "text-white/50" : "text-gray-500"}`}>
                      I agree to Quentrax's{" "}
                      <Link href="/terms" className="text-[hsl(263,70%,58%)] hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-[hsl(263,70%,58%)] hover:underline">Privacy Policy</Link>.
                      My data is protected by Genzzi's zero-knowledge protocol.
                    </span>
                  </motion.label>

                  {/* buttons row */}
                  <div className="flex gap-3 mt-1">
                    <motion.button type="button" onClick={() => { setStep(1); setError(""); }}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        isDark ? "border-white/15 text-white/70 hover:bg-white/8" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                      Back
                    </motion.button>
                    <motion.button type="submit" disabled={isLoading}
                      className="flex-[2] gradient-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                      whileHover={{ scale:1.02, boxShadow:"0 8px 32px -8px hsl(263 70% 58%/0.55)" }}
                      whileTap={{ scale:0.97 }}>
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin"/>Creating account…</>
                      ) : (
                        <><Zap className="w-4 h-4"/>Launch My Journey</>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

            </AnimatePresence>

            {/* footer trust */}
            <motion.div className={`mt-6 pt-5 border-t ${isDark ? "border-white/8" : "border-gray-200"} flex items-center justify-center gap-4`}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}>
              {[
                { icon: Lock,    label: "AES-256",       col: "hsl(142,76%,45%)" },
                { icon: Shield,  label: "Genzzi",        col: "hsl(263,70%,58%)" },
                { icon: Sparkles,label: "Zero-Knowledge",col: "hsl(330,80%,60%)" },
              ].map(({ icon: Icon, label, col }) => (
                <div key={label} className="flex items-center gap-1">
                  <Icon className="w-3 h-3" style={{ color: col }}/>
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