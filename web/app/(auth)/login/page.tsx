"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Fingerprint,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import SiteLogo from "../../../components/SiteLogo"; // ← FIX: replaced `import Image from "next/image"` (imported but never used)
                                                //         and raw `<img src="/logo.png">` (broken path, not optimized)
                                                //         with the SiteLogo component used everywhere else in the project

export default function LoginPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [shake, setShake] = useState(false);

  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const particles = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(n) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 15 }).map((_, i) => ({
      width: rand(i + 1) * 3 + 1,
      height: rand(i + 101) * 3 + 1,
      left: `${rand(i + 201) * 100}%`,
      top: `${rand(i + 301) * 100}%`,
      xOffset: rand(i + 1) * 15 - 7,
      duration: rand(i + 101) * 6 + 4,
      delay: rand(i + 401) * 3,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "demo@quentrax.com" || loginAttempts >= 1) {
      setShowMfa(true);
      setIsLoading(false);
      return;
    }
    if (email === "error@quentrax.com") {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError("Invalid credentials. Please check your email and password.");
      setLoginAttempts((prev) => prev + 1);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${
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
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              background: isDark
                ? "radial-gradient(circle, hsl(263 70% 58% / 0.4) 0%, transparent 70%)"
                : "radial-gradient(circle, hsl(263 70% 58% / 0.15) 0%, transparent 70%)",
            }}
            animate={{ y: [0, -20, 0], x: [0, p.xOffset, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>

      {/* Glow Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, hsl(263 70% 40% / 0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(263 70% 60% / 0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, hsl(330 80% 40% / 0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(330 80% 60% / 0.06) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl transition-all ${
          isDark
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
            : "bg-white/80 hover:bg-white text-gray-700 border border-black/10 shadow-lg"
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

      {/* Back to Home */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isDark
              ? "text-white/60 hover:text-white hover:bg-white/10"
              : "text-gray-500 hover:text-gray-800 hover:bg-black/5"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className={`relative w-full max-w-md mx-4 ${
          isDark
            ? "glass-card-lg"
            : "bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-2xl"
        } p-8 md:p-10`}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      >
        {/* Card Glow */}
        <div
          className={`absolute -inset-px rounded-[2.5rem] pointer-events-none ${
            isDark ? "glow-primary opacity-30" : ""
          }`}
        />

        {/* Logo & Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            {/* ── FIX: SiteLogo instead of <img src="/logo.png"> ── */}
            <SiteLogo variantIndex={0} className="w-full h-full object-contain drop-shadow-2xl" />
            {isDark && (
              <motion.div
                className="absolute inset-0 rounded-2xl glow-primary"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight mb-2">
            <span className="text-gradient">Welcome Back</span>
          </h1>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Genzzi Badge */}
        <motion.div
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold mb-6 ${
            isDark
              ? "bg-white/5 border border-white/10 text-white/70"
              : "bg-black/5 border border-black/10 text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Fingerprint className="w-4 h-4 text-[hsl(263,70%,58%)]" />
          Secured by Genzzi Identity Protocol v2.1
        </motion.div>

        <AnimatePresence mode="wait">
          {!showMfa ? (
            <motion.form
              key="login-form"
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className={`flex items-start gap-3 p-4 rounded-xl ${
                      isDark
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-red-50 border border-red-200"
                    }`}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 text-[hsl(0,84%,60%)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>
                        {error}
                      </p>
                      {loginAttempts >= 1 && (
                        <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                          {5 - loginAttempts} attempts remaining before account lock.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <motion.div
                className="space-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className={`text-sm font-semibold ml-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === "email"
                        ? "text-[hsl(263,70%,58%)]"
                        : isDark
                        ? "text-white/30"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`glass-input pl-12 pr-4 ${shake ? "animate-shake" : ""} ${
                      isDark ? "" : "bg-white border-gray-200 focus:border-[hsl(263,70%,58%)]"
                    }`}
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                className="space-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className={`text-sm font-semibold ml-1 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === "password"
                        ? "text-[hsl(263,70%,58%)]"
                        : isDark
                        ? "text-white/30"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className={`glass-input pl-12 pr-12 ${shake ? "animate-shake" : ""} ${
                      isDark ? "" : "bg-white border-gray-200 focus:border-[hsl(263,70%,58%)]"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]"
                        : isDark
                        ? "border-white/20 group-hover:border-white/40"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className={`text-sm font-medium transition-colors hover:underline ${
                    isDark
                      ? "text-[hsl(263,70%,58%)] hover:text-[hsl(263,70%,70%)]"
                      : "text-[hsl(263,70%,50%)]"
                  }`}
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="gradient-primary w-full py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? "border-white/10" : "border-gray-200"}`} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span
                    className={`px-4 ${
                      isDark ? "bg-[hsl(260,45%,7%)] text-white/40" : "bg-white text-gray-400"
                    }`}
                  >
                    or continue with
                  </span>
                </div>
              </motion.div>

              {/* Genzzi SSO */}
              <motion.button
                type="button"
                className={`w-full py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 border transition-all ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Fingerprint className="w-5 h-5 text-[hsl(263,70%,58%)]" />
                Sign in with Genzzi
              </motion.button>

              {/* Sign Up Link */}
              <motion.p
                className={`text-center text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className={`font-semibold transition-colors hover:underline ${
                    isDark ? "text-[hsl(263,70%,58%)]" : "text-[hsl(263,70%,50%)]"
                  }`}
                >
                  Create one
                </Link>
              </motion.p>
            </motion.form>
          ) : (
            /* MFA Step */
            <motion.form
              key="mfa-form"
              onSubmit={handleMfaSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
            >
              <div className="text-center">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-white/10" : "bg-[hsl(263,70%,58%)]/10"
                  }`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-8 h-8 text-[hsl(263,70%,58%)]" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Two-Factor Authentication</h2>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* MFA Code Inputs */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.input
                    key={i}
                    id={`mfa-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
                      isDark
                        ? "bg-white/5 border-white/20 text-white focus:border-[hsl(263,70%,58%)]"
                        : "bg-white border-gray-200 text-gray-800 focus:border-[hsl(263,70%,58%)]"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    value={mfaCode[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const chars = mfaCode.split("");
                      chars[i] = val;
                      setMfaCode(chars.join(""));
                      if (val && i < 5) {
                        document.getElementById(`mfa-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !mfaCode[i] && i > 0) {
                        document.getElementById(`mfa-${i - 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={() => setShowMfa(false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading || mfaCode.replace(/\s/g, "").length !== 6}
                  className="gradient-primary flex-[2] py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Sign In"
                  )}
                </motion.button>
              </div>

              <p className={`text-center text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
                Can&apos;t access your authenticator?{" "}
                <button type="button" className="text-[hsl(263,70%,58%)] hover:underline">
                  Use backup code
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Trust */}
        <motion.div
          className={`mt-8 pt-6 border-t ${isDark ? "border-white/10" : "border-gray-200"} text-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>AES-256</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[hsl(263,70%,58%)]" />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Genzzi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(330,80%,60%)]" />
              <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Zero-Knowledge</span>
            </div>
          </div>
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
            Quentrax — Secured by Genzzi Identity Protocol v2.1
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}