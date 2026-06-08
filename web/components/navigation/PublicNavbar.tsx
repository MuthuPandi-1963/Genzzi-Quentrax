"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, Sparkles, BookOpen, Trophy, Grid3X3, Layers,
  HelpCircle, LogIn, UserPlus, Search,Zap
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  NAV LINKS
// ═══════════════════════════════════════════════════════════════
const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/topics", label: "Topics", icon: Layers },
  { href: "/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/about", label: "About", icon: Zap },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

// ═══════════════════════════════════════════════════════════════
//  MOBILE NAV ITEM
// ═══════════════════════════════════════════════════════════════
function MobileNavItem({
  link, isActive, onClick, index,
}: {
  link: typeof navLinks[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
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
          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
          : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{link.label}</span>
      {isActive && (
        <motion.div
          layoutId="mobileActiveIndicator"
          className="ml-auto w-2 h-2 rounded-full bg-[var(--color-primary)]"
        />
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DESKTOP NAV LINK
// ═══════════════════════════════════════════════════════════════
function DesktopNavLink({ link, isActive }: { link: typeof navLinks[0]; isActive: boolean }) {
  const router = useRouter();
  const Icon = link.icon;

  return (
    <motion.button
      onClick={() => router.push(link.href)}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
        isActive
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      {link.label}
      {isActive && (
        <motion.div
          layoutId="desktopActiveIndicator"
          className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PUBLIC NAVBAR
// ═══════════════════════════════════════════════════════════════
export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { scrollY } = useScroll();
  const navBackground = useTransform(scrollY, [0, 50], ["rgba(17, 12, 28, 0)", "rgba(17, 12, 28, 0.85)"]);
  const navBackdrop = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(20px) saturate(1.2)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
        className="fixed top-0 left-0 right-0 z-[var(--z-index-fixed)] border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            {/* ─── Logo ────────────────────────────────────────── */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Sparkles className="w-5 h-5 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]"
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

            {/* ─── Desktop Nav ─────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <DesktopNavLink key={link.href} link={link} isActive={isActive(link.href)} />
              ))}
            </nav>

            {/* ─── Desktop Actions ─────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-9 h-9 rounded-lg bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              <div className="w-px h-6 bg-[var(--color-border)]" />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="gradient-primary px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Get Started
              </motion.button>
            </div>

            {/* ─── Mobile Actions ──────────────────────────────── */}
            <div className="flex lg:hidden items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-foreground-muted)] border border-[var(--color-border)]"
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground)]"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ─── Search Bar (Expandable) ─────────────────────── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-[var(--color-border)]/50"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-subtle)]" />
                  <input
                    type="text"
                    placeholder="Search quizzes, topics, categories..."
                    autoFocus
                    className="glass-input pl-12 pr-4 py-3 w-full text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        router.push(`/quizzes?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══ Mobile Menu Overlay ═══════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[var(--color-background)]/80 backdrop-blur-xl z-[var(--z-index-modal-backdrop)] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-[var(--color-background-elevated)] border-l border-[var(--color-border)] z-[var(--z-index-modal)] lg:hidden flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
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
                <AnimatePresence>
                  {navLinks.map((link, i) => (
                    <MobileNavItem
                      key={link.href}
                      link={link}
                      isActive={isActive(link.href)}
                      onClick={() => router.push(link.href)}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/login")}
                  className="w-full glass-card-sm px-4 py-3 rounded-xl text-[var(--color-foreground)] font-medium flex items-center justify-center gap-2"
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
                  Get Started Free
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