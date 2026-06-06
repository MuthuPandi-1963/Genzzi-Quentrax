"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  Menu,
  X,
  Moon,
  Sun,
  Code2,
  Globe,
  Cpu,
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   QUENTRAX — LANDING PAGE
   Deep Purple Space + Neon Accents + Glassmorphism
   Dark & Light Themes with Animated UX
   ═══════════════════════════════════════════════════════════════ */

const heroTaglines = [
  "Think Beyond Answers.",
  "Where Minds Compete.",
  "Quiz the Future.",
  "Knowledge Meets Speed.",
  "Smart Starts Here.",
];

const stats = [
  { icon: Users, value: "10,000+", label: "Active Learners" },
  { icon: Trophy, value: "50,000+", label: "Quizzes Taken" },
  { icon: Brain, value: "1M+", label: "Questions Answered" },
  { icon: Star, value: "4.9", label: "Average Rating" },
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
  { label: "PKCE", icon: Code2 },
  { label: "E2E Encrypted", icon: Lock },
];

const trustBadges = ["A", "B", "C", "D"];

const categories = [
  { name: "Science", icon: "🔬", color: "badge-science", count: 120 },
  { name: "Technology", icon: "💻", color: "badge-tech", count: 85 },
  { name: "History", icon: "📜", color: "badge-history", count: 64 },
  { name: "Geography", icon: "🌍", color: "badge-geography", count: 92 },
  { name: "Arts", icon: "🎨", color: "badge-arts", count: 45 },
  { name: "Sports", icon: "⚽", color: "badge-sports", count: 78 },
];

const howItWorks = [
  { step: "01", title: "Browse", desc: "Explore thousands of quizzes across every topic imaginable.", icon: Globe },
  { step: "02", title: "Compete", desc: "Test your knowledge against timed challenges and leaderboards.", icon: Target },
  { step: "03", title: "Earn", desc: "Collect coins, climb ranks, and unlock achievements.", icon: Award },
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

export default function QuentraxLanding() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentTagline, setCurrentTagline] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % heroTaglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        isDark
          ? "bg-[hsl(260,50%,4%)] text-white"
          : "bg-[hsl(260,20%,96%)] text-[hsl(260,50%,10%)]"
      }`}
      style={{
        backgroundImage: isDark
          ? `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 20% / 0.3), transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 30% / 0.15), transparent),
             radial-gradient(ellipse 40% 60% at 20% 100%, hsl(217 90% 30% / 0.1), transparent)`
          : `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 60% / 0.08), transparent),
             radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 60% / 0.05), transparent)`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION
         ═══════════════════════════════════════════════════════════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[300] transition-all duration-500 ${
          scrolled
            ? isDark
              ? "bg-[hsl(260,50%,4%)]/80 backdrop-blur-glass border-b border-white/10"
              : "bg-white/80 backdrop-blur-glass border-b border-black/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-10 h-10">
              <img
                src="/logo.png"
                alt="Quentrax"
                className="w-full h-full object-contain"
              />
              <div className={`absolute inset-0 rounded-xl ${isDark ? "glow-primary" : ""}`} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-gradient">Quentrax</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Categories", "Security", "Testimonials"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-black/5 hover:bg-black/10 text-gray-700"
              }`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <Moon key="moon" className="w-5 h-5" />
                ) : (
                  <Sun key="sun" className="w-5 h-5" />
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.a
                href="/login"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-black/5"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.a>
              <motion.a
                href="/register"
                className="gradient-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={`md:hidden border-t ${
                isDark ? "border-white/10 bg-[hsl(260,50%,4%)]/95" : "border-black/5 bg-white/95"
              } backdrop-blur-glass`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-3">
                {["Features", "How It Works", "Categories", "Security", "Testimonials"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    className={`block py-2 text-sm font-medium ${
                      isDark ? "text-white/70" : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-3 flex gap-3">
                  <a href="/login" className="flex-1 text-center py-2.5 rounded-xl border border-current text-sm font-semibold">
                    Sign In
                  </a>
                  <a href="/register" className="flex-1 text-center py-2.5 rounded-xl gradient-primary text-sm font-semibold">
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Futuristic & Premium
         ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Hero Glow Orb */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, hsl(263 70% 40% / 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, hsl(263 70% 60% / 0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white/90"
                : "bg-black/5 border border-black/10 text-gray-700"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-[hsl(263,70%,58%)]" />
            Powered by Genzzi Identity Protocol v2.1
          </motion.div>

          {/* Logo Large */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="relative">
              <img
                src="../public/logo.png"
                alt="Quentrax"
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
              <motion.div
                className={`absolute inset-0 rounded-3xl ${isDark ? "glow-primary" : ""}`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-gradient">Quentrax</span>
          </motion.h1>

          {/* Animated Tagline */}
          <div className="h-16 md:h-20 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                className={`text-2xl md:text-4xl font-light tracking-wide ${
                  isDark ? "text-white/80" : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.6 }}
              >
                {heroTaglines[currentTagline]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description */}
          <motion.p
            className={`max-w-2xl mx-auto text-lg mb-10 ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            The next-generation quiz & assessment platform. Secure, gamified, and 
            powered by decentralized identity. No passwords. No compromises.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href="/register"
              className="gradient-primary px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px hsl(263 70% 58% / 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
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

          {/* Stats Bar */}
          <motion.div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto ${
              isDark ? "glass-card" : "bg-white/60 backdrop-blur-xl rounded-3xl border border-black/5 shadow-xl"
            } p-6`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-[hsl(263,70%,58%)]" />
                <div className="text-2xl font-black text-gradient">{stat.value}</div>
                <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
            isDark ? "border-white/30" : "border-gray-400"
          }`}>
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/60" : "bg-gray-500"}`}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════════════════════════════ */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                className={`${isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-xl"} p-8 relative overflow-hidden group`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <div className="absolute top-4 right-4 text-6xl font-black opacity-5">
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                }`}>
                  <item.icon className="w-7 h-7 text-[hsl(263,70%,58%)]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className={`${isDark ? "text-white/60" : "text-gray-500"}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES
         ═══════════════════════════════════════════════════════════════ */}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.name}
                href={`/categories/${cat.name.toLowerCase()}`}
                className={`${isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"} p-6 flex items-center gap-4 group cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <span className="text-4xl">{cat.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    {cat.count} quizzes
                  </p>
                </div>
                <div className={`${cat.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                  Explore
                </div>
                <ArrowRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? "text-white/60" : "text-gray-400"
                }`} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECURITY / GENZZI SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="security" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full ${
            isDark ? "bg-purple-500/10" : "bg-purple-500/5"
          } blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full ${
            isDark ? "bg-pink-500/10" : "bg-pink-500/5"
          } blur-3xl`} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 ${
              isDark ? "bg-white/10 border border-white/20" : "bg-black/5 border border-black/10"
            }`}>
              <Shield className="w-4 h-4 text-[hsl(263,70%,58%)]" />
              Powered by Genzzi
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Secured by Genzzi</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? "text-white/60" : "text-gray-500"}`}>
              Genzzi is the decentralized identity layer securing Quentrax. 
              No passwords. No data breaches. Just seamless, encrypted access.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`${isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"} p-8 flex items-start gap-5`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className={`${isDark ? "text-white/60" : "text-gray-500"}`}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why Genzzi */}
          <motion.div
            className={`${isDark ? "glass-card-lg" : "bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-xl"} p-8 md:p-12 mb-16`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-black mb-4">
                  <span className="text-gradient">Why Genzzi powers Quentrax</span>
                </h3>
                <p className={`text-lg mb-6 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                  Traditional logins store your password on our servers. Genzzi doesn't. 
                  Your identity is verified cryptographically — we never see your secrets. 
                  One Genzzi account works across all ecosystem apps: Quentrax, and whatever comes next.
                </p>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech) => (
                    <span
                      key={tech.label}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                        isDark ? "bg-white/10 text-white" : "bg-black/5 text-gray-700"
                      }`}
                    >
                      <tech.icon className="w-4 h-4 text-[hsl(263,70%,58%)]" />
                      {tech.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {trustBadges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    className={`${isDark ? "glass-card-sm" : "bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5"} p-6 text-center`}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
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

          {/* Trust Stats */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[hsl(263,70%,58%)]" />
              <span className="text-3xl font-black text-gradient">10,000+</span>
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

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════════════════════════════════ */}
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
              { icon: Brain, title: "Smart Quizzes", desc: "Adaptive difficulty that grows with your knowledge." },
              { icon: Trophy, title: "Leaderboards", desc: "Compete globally and climb the ranks in real-time." },
              { icon: Zap, title: "Live Assessments", desc: "Timed proctored exams with anti-cheat detection." },
              { icon: Award, title: "Gamified Learning", desc: "Earn coins, unlock badges, and level up." },
              { icon: TrendingUp, title: "Progress Tracking", desc: "Detailed analytics on your learning journey." },
              { icon: Target, title: "Custom Assessments", desc: "Create and assign quizzes to your students." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`${isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"} p-8`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                }`}>
                  <feature.icon className="w-6 h-6 text-[hsl(263,70%,58%)]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════════════════════════════ */}
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
                className={`${isDark ? "glass-card" : "bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-lg"} p-8 relative`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[hsl(45,95%,55%)] text-[hsl(45,95%,55%)]" />
                  ))}
                </div>
                <p className={`text-sm mb-6 leading-relaxed ${isDark ? "text-white/80" : "text-gray-600"}`}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          className={`max-w-4xl mx-auto text-center ${
            isDark ? "glass-card-lg" : "bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-xl"
          } p-12 md:p-16 relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full ${
              isDark ? "bg-purple-500/20" : "bg-purple-500/10"
            } blur-3xl`} />
          </div>

          <div className="relative z-10">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img src="../public/logo.png" alt="Quentrax" className="w-full h-full object-contain" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gradient">Ready to Quiz the Future?</span>
            </h2>
            <p className={`text-lg mb-8 max-w-xl mx-auto ${isDark ? "text-white/70" : "text-gray-600"}`}>
              Join thousands of learners mastering new skills every day. 
              Secure, gamified, and completely free to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/register"
                className="gradient-primary px-10 py-4 rounded-2xl text-lg font-bold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
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

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════════════════ */}
      <footer className={`border-t ${isDark ? "border-white/10" : "border-black/5"} py-16 px-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Quentrax" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-gradient">Quentrax</span>
              </div>
              <p className={`text-sm mb-4 ${isDark ? "text-white/50" : "text-gray-500"}`}>
                The next-generation quiz & assessment platform powered by Genzzi.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Shield className="w-3 h-3" />
                Secured by Genzzi v2.1
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2">
                {["Quizzes", "Assessments", "Leaderboard", "Categories", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2">
                {["Documentation", "API Reference", "Blog", "Community", "Support"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`text-sm transition-colors ${
                      isDark ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-800"
                    }`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t ${isDark ? "border-white/10" : "border-black/5"} flex flex-col md:flex-row items-center justify-between gap-4`}>
            <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
              © 2026 Quentrax. All rights reserved. Secured by Genzzi Identity Protocol.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "Discord"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className={`text-xs transition-colors ${
                    isDark ? "text-white/30 hover:text-white" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
