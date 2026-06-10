"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  Monitor,
  Home,
  Info,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
  
];

function MobileNavItem({
  link,
  isActive,
  onClick,
  index,
  isDark,
}: {
  link: (typeof navLinks)[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
  isDark: boolean;
}) {
  const Icon = link.icon;
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
        isActive
          ? "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border border-[hsl(263,70%,58%)]/20"
          : isDark
          ? "text-white/60 hover:bg-white/5 hover:text-white"
          : "text-gray-500 hover:bg-black/5 hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{link.label}</span>
      {isActive && (
        <motion.div
          layoutId="mobileActiveIndicator"
          className="ml-auto w-2 h-2 rounded-full bg-[hsl(263,70%,58%)]"
        />
      )}
    </motion.button>
  );
}

function DesktopNavLink({
  link,
  isActive,
  isDark,
}: {
  link: (typeof navLinks)[0];
  isActive: boolean;
  isDark: boolean;
}) {
  const router = useRouter();
  const Icon = link.icon;

  return (
    <motion.button
      onClick={() => router.push(link.href)}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
        isActive
          ? "text-[hsl(263,70%,58%)]"
          : isDark
          ? "text-white/60 hover:text-white"
          : "text-gray-500 hover:text-gray-900"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      {link.label}
      {isActive && (
        <motion.div
          layoutId="desktopActiveIndicator"
          className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-[hsl(263,70%,58%)] to-[hsl(330,80%,55%)] rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default function PublicNavbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mode = (theme as "dark" | "light" | "system") || "system";
  const setMode = setTheme;
  const isDark = resolvedTheme === "dark";

  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    isDark
      ? ["rgba(17, 12, 28, 0)", "rgba(17, 12, 28, 0.85)"]
      : ["rgba(248, 247, 252, 0)", "rgba(248, 247, 252, 0.85)"]
  );
  const navBackdrop = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(20px) saturate(1.2)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    isDark
      ? ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]
      : ["rgba(26, 20, 41, 0)", "rgba(26, 20, 41, 0.08)"]
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        style={{
          backgroundColor: navBackground,
          backdropFilter: navBackdrop,
          borderBottomColor: navBorder,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,55%)] flex items-center justify-center shadow-lg shadow-[hsl(263,70%,58%)]/20">
                <Sparkles className="w-5 h-5 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,55%)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[var(--color-foreground)] leading-tight tracking-tight">
                  Quentrax
                </span>
                <span className="text-[10px] text-[var(--color-foreground-subtle)] leading-none tracking-wider uppercase">
                  by Genzzi
                </span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  link={link}
                  isActive={isActive(link.href)}
                  isDark={isDark}
                />
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme picker */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="w-9 h-9 rounded-lg bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mode === "dark" && <Moon className="w-4 h-4" />}
                      {mode === "light" && <Sun className="w-4 h-4" />}
                      {mode === "system" && <Monitor className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {showThemeMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-40 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl shadow-xl p-1 z-50"
                    >
                      {([
                        { value: "light" as const, label: "Light", icon: Sun },
                        { value: "dark" as const, label: "Dark", icon: Moon },
                        { value: "system" as const, label: "System", icon: Monitor },
                      ]).map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setMode(option.value);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            mode === option.value
                              ? "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)]"
                              : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-6 bg-[var(--color-border)]" />

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isDark
                    ? "text-white/60 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>

              {/* Register Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="gradient-primary px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground)]"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[var(--color-background)]/80 backdrop-blur-xl z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-[var(--color-background-elevated)] border-l border-[var(--color-border)] z-50 md:hidden flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(330,80%,55%)] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-[var(--color-foreground)]">Menu</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground-muted)]"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <MobileNavItem
                    key={link.href}
                    link={link}
                    isActive={isActive(link.href)}
                    onClick={() => router.push(link.href)}
                    index={i}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                {/* Theme toggle in mobile */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-[var(--color-foreground-muted)]">Theme</span>
                  <div className="flex gap-1">
                    {([
                      { value: "light" as const, icon: Sun },
                      { value: "dark" as const, icon: Moon },
                      { value: "system" as const, icon: Monitor },
                    ]).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMode(option.value)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          mode === option.value
                            ? "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)]"
                            : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)]"
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/login")}
                  className="w-full glass-card-sm px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/register")}
                  className="w-full gradient-primary px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-[4.5rem]" />
    </>
  );
}