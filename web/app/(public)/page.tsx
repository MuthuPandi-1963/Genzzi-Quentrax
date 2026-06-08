"use client";

import SiteLogo from "../../components/SiteLogo";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/footer/PubicFooter";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Fingerprint,
  Zap,
  ChevronRight,
  Star,
  Users,
  Trophy,
  Brain,
  Sparkles,
  ArrowRight,
  Code2,
  Globe,
  Award,
  TrendingUp,
  Target,
} from "lucide-react";

const heroTaglines = [
  "Think Beyond Answers.",
  "Where Minds Compete.",
  "Quiz the Future.",
  "Knowledge Meets Speed.",
  "Smart Starts Here.",
];

const stats = [
  { icon: Users,  value: 10000, suffix: "+", label: "Active Learners" },
  { icon: Trophy, value: 50000, suffix: "+", label: "Quizzes Taken" },
  { icon: Brain,  value: 1,     suffix: "M+", label: "Questions Answered" },
  { icon: Star,   value: 4.9,   suffix: "",   label: "Average Rating" },
];

const features = [
  {
    icon: Shield,
    title: "Passwordless",
    desc: "No passwords. Cryptographic identity verification via Genzzi.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Lock,
    title: "Encrypted",
    desc: "AES-256-GCM. Your data, your control. Always.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge",
    desc: "We can't read your answers. Ever. Full privacy.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Fingerprint,
    title: "One Identity",
    desc: "One Genzzi login. All ecosystem apps connected.",
    color: "from-orange-500 to-amber-500",
  },
];

const techStack = [
  { label: "OAuth 2.1", icon: Globe },
  { label: "PKCE",      icon: Code2 },
  { label: "E2E Encrypted", icon: Lock },
];

const trustBadges = ["A", "B", "C", "D"];

const categories = [
  { name: "Science",    icon: "🔬", color: "badge-science",   count: 120 },
  { name: "Technology", icon: "💻", color: "badge-tech",      count: 85 },
  { name: "History",    icon: "📜", color: "badge-history",   count: 64 },
  { name: "Geography",  icon: "🌍", color: "badge-geography", count: 92 },
  { name: "Arts",       icon: "🎨", color: "badge-arts",      count: 45 },
  { name: "Sports",     icon: "⚽", color: "badge-sports",    count: 78 },
];

const howItWorks = [
  { step: "01", title: "Browse",  desc: "Explore thousands of quizzes across every topic imaginable.", icon: Globe },
  { step: "02", title: "Compete", desc: "Test your knowledge against timed challenges and leaderboards.", icon: Target },
  { step: "03", title: "Earn",    desc: "Collect coins, climb ranks, and unlock achievements.", icon: Award },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    text: "Quentrax transformed how I prepare for technical interviews. The gamified approach makes learning addictive!",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "University Student",
    text: "The assessment feature is incredible. My professors use it for exams and the proctoring is seamless.",
    avatar: "MJ",
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist",
    text: "I love the leaderboard. Competing with friends makes studying feel less like work and more like play.",
    avatar: "AP",
  },
];

/* ─── Helpers ───────────────────────────────────────────────── */

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* ─── Sub-components ────────────────────────────────────────── */

function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(parseFloat((eased * value).toFixed(decimals)));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
      {suffix}
    </span>
  );
}

function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          background: hovered
            ? `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, hsl(263 70% 58% / 0.12), transparent 70%)`
            : "transparent",
          transition: "background 0.1s",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function CursorOrb({ isDark }: { isDark: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 150);
      y.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!isDark) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 300,
        height: 300,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, hsl(263 70% 58% / 0.06) 0%, transparent 70%)",
      }}
    />
  );
}

/* ─── Main component ────────────────────────────────────────── */

export default function LandingPage() {
const [theme, setTheme] = useState<"dark" | "light">("light");
  const [currentTagline, setCurrentTagline] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
  const heroY      = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTagline((p) => (p + 1) % heroTaglines.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  const bgImage = isDark
    ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 20% / 0.3), transparent),
       radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 30% / 0.15), transparent),
       radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30% / 0.1), transparent)`
    : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60% / 0.08), transparent),
       radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 60% / 0.05), transparent)`;

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        isDark
          ? "bg-[hsl(260,50%,4%)] text-white"
          : "bg-[hsl(260,20%,96%)] text-[hsl(260,50%,10%)]"
      }`}
      style={{ backgroundImage: bgImage, backgroundAttachment: "fixed" }}
    >
      <CursorOrb isDark={isDark} />
    

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(hsl(263 70% 58% / 0.05) 1px, transparent 1px),
                 linear-gradient(90deg, hsl(263 70% 58% / 0.05) 1px, transparent 1px)`
              : `linear-gradient(hsl(263 70% 58% / 0.04) 1px, transparent 1px),
                 linear-gradient(90deg, hsl(263 70% 58% / 0.04) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => {
            const left   = `${seededRand(i + 1) * 100}%`;
            const top    = `${seededRand(i + 101) * 100}%`;
            const size   = seededRand(i + 201) * 4 + 2;
            const dur    = seededRand(i + 301) * 8 + 6;
            const delay  = seededRand(i + 401) * 4;
            const xOff   = seededRand(i + 501) * 30 - 15;
            const isGold = i % 5 === 0;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left,
                  top,
                  background: isGold
                    ? "hsl(45 95% 55%)"
                    : "hsl(263 70% 58%)",
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, xOff, 0],
                  opacity: [0, 0.7, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            );
          })}
        </div>

        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, hsl(263 70% 40% / 0.28) 0%, transparent 70%)"
              : "radial-gradient(circle, hsl(263 70% 60% / 0.1) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white/90"
                : "bg-black/5 border border-black/10 text-gray-700"
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(263,70%,58%)]" />
            </motion.div>
            Powered by Genzzi Identity Protocol v2.1
          </motion.div>

          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 12 }}
          >
            <div className="relative">
              <SiteLogo variantIndex={1} className="w-24 h-24 object-contain drop-shadow-2xl" />
              {isDark && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: "0 0 40px 10px hsl(263 70% 58% / 0.4)" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>

          <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 overflow-hidden">
            {"Quentrax".split("").map((char, i) => (
              <motion.span
                key={i}
                className="text-gradient inline-block"
                initial={{ y: 100, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.4 + i * 0.06,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <div className="h-16 md:h-20 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                className={`text-2xl md:text-4xl font-light tracking-wide ${
                  isDark ? "text-white/80" : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(12px)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                {heroTaglines[currentTagline]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            className={`max-w-2xl mx-auto text-lg mb-10 ${isDark ? "text-white/60" : "text-gray-500"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            The next-generation quiz & assessment platform. Secure, gamified, and powered by
            decentralized identity. No passwords. No compromises.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <motion.a
              href="/register"
              className="gradient-primary px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: isDark ? "0 0 0 0 hsl(263 70% 58% / 0)" : undefined }}
              animate={
                isDark
                  ? { boxShadow: ["0 0 0 0 hsl(263 70% 58% / 0.4)", "0 0 0 16px hsl(263 70% 58% / 0)", "0 0 0 0 hsl(263 70% 58% / 0)"] }
                  : {}
              }
              transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
            >
              Start Your Journey
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
            <motion.a
              href="/quizzes"
              className={`px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-2 border transition-all ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-black/10 text-gray-800 hover:bg-black/5"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Quizzes
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto ${
              isDark
                ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                : "bg-white/60 backdrop-blur-xl rounded-3xl border border-black/5 shadow-xl"
            } p-6`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, type: "spring" }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.12 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-[hsl(263,70%,58%)]" />
                </motion.div>
                <div className="text-2xl font-black text-gradient">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                  />
                </div>
                <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
                isDark ? "border-white/30" : "border-gray-400"
              }`}
            >
              <motion.div
                className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/60" : "bg-gray-500"}`}
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Three simple steps to mastery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-transparent via-[hsl(263,70%,58%)]/40 to-transparent" />

            {howItWorks.map((item, i) => (
              <SpotlightCard
                key={item.step}
                className={`${
                  isDark
                    ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                    : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-xl"
                } p-8 relative overflow-hidden group`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.18, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -6 }}
                >
                  <motion.div
                    className="absolute top-4 right-4 text-7xl font-black select-none"
                    style={{ color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                    whileHover={{ scale: 1.2, color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
                  >
                    {item.step}
                  </motion.div>

                  <motion.div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                    }`}
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className="w-7 h-7 text-[hsl(263,70%,58%)]" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className={isDark ? "text-white/60" : "text-gray-500"}>{item.desc}</p>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══════════════════════════════════════════ */}
      <section id="categories" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Explore Categories</span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Dive into any topic. From science to sports, we have it all.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.name}
                href={`/categories/${cat.name.toLowerCase()}`}
                className={`${
                  isDark
                    ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-[hsl(263,70%,58%)]/40"
                    : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg hover:border-[hsl(263,70%,58%)]/30"
                } p-6 flex items-center gap-4 group cursor-pointer transition-colors`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring" }}
                whileHover={{ scale: 1.03, x: 6 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.3, rotate: [-5, 5, -5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {cat.icon}
                </motion.span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    {cat.count} quizzes
                  </p>
                </div>
                <div
                  className={`${cat.color} px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  Explore
                </div>
                <motion.div
                  initial={{ x: -4, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className={isDark ? "text-white/60" : "text-gray-400"}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECURITY / GENZZI ═══════════════════════════════════ */}
      <section id="security" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className={`absolute top-0 left-1/4 w-96 h-96 rounded-full ${isDark ? "bg-purple-500/10" : "bg-purple-500/5"} blur-3xl`}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full ${isDark ? "bg-pink-500/10" : "bg-pink-500/5"} blur-3xl`}
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 ${
                isDark ? "bg-white/10 border border-white/20" : "bg-black/5 border border-black/10"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Shield className="w-4 h-4 text-[hsl(263,70%,58%)]" />
              </motion.div>
              Powered by Genzzi
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Secured by Genzzi</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Genzzi is the decentralized identity layer securing Quentrax. No passwords. No data
              breaches. Just seamless, encrypted access.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, i) => (
              <SpotlightCard
                key={feature.title}
                className={`${
                  isDark
                    ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                    : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
                } p-8 flex items-start gap-5`}
              >
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex items-start gap-5 w-full"
                >
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className={isDark ? "text-white/60" : "text-gray-500"}>{feature.desc}</p>
                  </div>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>

          <motion.div
            className={`${
              isDark
                ? "bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10"
                : "bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-xl"
            } p-8 md:p-12 mb-16`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-black mb-4">
                  <span className="text-gradient">Why Genzzi powers Quentrax</span>
                </h3>
                <p className={`text-lg mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  Traditional logins store your password on our servers. Genzzi doesn't. Your
                  identity is verified cryptographically — we never see your secrets. One Genzzi
                  account works across all ecosystem apps.
                </p>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, i) => (
                    <motion.span
                      key={tech.label}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                        isDark ? "bg-white/10 text-white" : "bg-black/5 text-gray-700"
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                    >
                      <tech.icon className="w-4 h-4 text-[hsl(263,70%,58%)]" />
                      {tech.label}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {trustBadges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    className={`${
                      isDark
                        ? "bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
                        : "bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5"
                    } p-6 text-center`}
                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08, rotate: 3 }}
                  >
                    <div className="text-4xl font-black text-gradient mb-2">{badge}</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                      Security Tier
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[hsl(263,70%,58%)]" />
              <span className="text-3xl font-black text-gradient">
                <AnimatedCounter value={10000} suffix="+" />
              </span>
            </div>
            <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
              developers trust Genzzi daily
            </p>
            <p className={`mt-4 text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
              Quentrax — Secured by Genzzi Identity Protocol v2.1
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Everything You Need</span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Built for learners, educators, and competitive minds
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain,     title: "Smart Quizzes",      desc: "Adaptive difficulty that grows with your knowledge." },
              { icon: Trophy,    title: "Leaderboards",        desc: "Compete globally and climb the ranks in real-time." },
              { icon: Zap,       title: "Live Assessments",    desc: "Timed proctored exams with anti-cheat detection." },
              { icon: Award,     title: "Gamified Learning",   desc: "Earn coins, unlock badges, and level up." },
              { icon: TrendingUp,title: "Progress Tracking",   desc: "Detailed analytics on your learning journey." },
              { icon: Target,    title: "Custom Assessments",  desc: "Create and assign quizzes to your students." },
            ].map((feature, i) => (
              <SpotlightCard
                key={feature.title}
                className={`${
                  isDark
                    ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-[hsl(263,70%,58%)]/30"
                    : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
                } p-8 transition-colors`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                  whileHover={{ y: -6 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                    }`}
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="w-6 h-6 text-[hsl(263,70%,58%)]" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                    {feature.desc}
                  </p>
                </motion.div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Loved by Learners</span>
            </h2>
            <p className={`text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              See what our community has to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className={`${
                  isDark
                    ? "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                    : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"
                } p-8 relative`}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + j * 0.06, type: "spring" }}
                    >
                      <Star className="w-4 h-4 fill-[hsl(45,95%,55%)] text-[hsl(45,95%,55%)]" />
                    </motion.div>
                  ))}
                </div>
                <p className={`text-sm mb-6 leading-relaxed ${isDark ? "text-white/80" : "text-gray-600"}`}>
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white"
                    whileHover={{ scale: 1.2 }}
                  >
                    {t.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          className={`max-w-4xl mx-auto text-center ${
            isDark
              ? "bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10"
              : "bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-xl"
          } p-12 md:p-16 relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full ${
                isDark ? "bg-purple-500/20" : "bg-purple-500/10"
              } blur-3xl`}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              className="w-20 h-20 mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0], y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <SiteLogo variantIndex={0} className="w-full h-full object-contain" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Ready to Quiz the Future?</span>
            </h2>
            <p className={`text-lg mb-8 max-w-xl mx-auto ${isDark ? "text-white/70" : "text-gray-600"}`}>
              Join thousands of learners mastering new skills every day. Secure, gamified, and
              completely free to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/register"
                className="gradient-primary px-10 py-4 rounded-2xl text-lg font-bold flex items-center gap-2 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.a>
              <motion.a
                href="/quizzes"
                className={`px-10 py-4 rounded-2xl text-lg font-bold border transition-all ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-black/10 text-gray-800 hover:bg-black/5"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Quizzes
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

     
    </div>
  );
}