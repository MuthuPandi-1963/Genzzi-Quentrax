"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
  Grid3X3,
  Layers,
  BookOpen,
  Zap,
  Mail,
  LogOut,
  User,
  LayoutDashboard,
  Trophy,
  Settings,
  Users,
  BarChart3,
  GraduationCap,
  ChevronDown,
  Crown,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button as GenzziButton } from "@genzzi/oauth-client";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";
import { UserRole } from "@/@types/enums";

const ROLE_NAV_LINKS: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  STUDENT: [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/categories", label: "Categories", icon: Grid3X3 },
    { href: "/topics", label: "Topics", icon: Layers },
    { href: "/quizzes", label: "Quizzes", icon: BookOpen },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  STAFF: [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/courses", label: "My Courses", icon: BookOpen },
    { href: "/staff/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/quizzes", label: "Quizzes", icon: Layers },
  ],
  ADMIN: [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/quizzes", label: "Quizzes", icon: BookOpen },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

const PUBLIC_LINKS = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/topics", label: "Topics", icon: Layers },
  { href: "/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/about", label: "About", icon: Zap },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: Mail },
];

// ── Role styling ────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  STUDENT: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: GraduationCap,
  },
  STAFF: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: BookOpen,
  },
  ADMIN: {
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: Crown,
  },
};

// ── Components ──────────────────────────────────────────────────────────────

function MobileNavItem({
  link,
  isActive,
  onClick,
  index,
}: {
  link: { href: string; label: string; icon: React.ElementType };
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = link.icon;
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{link.label}</span>
      {isActive && (
        <motion.div
          layoutId="mobileActiveIndicator"
          className="ml-auto w-2 h-2 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
}

function DesktopNavLink({
  link,
  isActive,
}: {
  link: { href: string; label: string; icon: React.ElementType };
  isActive: boolean;
}) {
  const router = useRouter();
  const Icon = link.icon;

  return (
    <motion.button
      onClick={() => router.push(link.href)}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      {link.label}
      {isActive && (
        <motion.div
          layoutId="desktopActiveIndicator"
          className="absolute -bottom-1 left-2 right-2 h-0.5 bg-linear-to-r from-primary to-accent rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const client_id = process.env.NEXT_PUBLIC_GENZZI_CLIENT_ID;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node) &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(event.target as Node)
      ) {
        setShowThemeMenu(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mode = mounted ? ((theme as "dark" | "light" | "system") ?? "system") : "system";
  const isDark = mounted && resolvedTheme === "dark";

  const { scrollY } = useScroll();

  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    isDark
      ? ["rgba(17, 12, 28, 0)", "rgba(17, 12, 28, 0.85)"]
      : ["rgba(248, 247, 252, 0)", "rgba(248, 247, 252, 0.85)"]
  );

  const bgOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);

  const backgroundColor = useTransform(
    bgOpacity,
    (opacity) =>
      isDark ? `rgba(17, 12, 28, ${opacity})` : `rgba(248, 247, 252, ${opacity})`
  );

  const borderColor = useTransform(
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
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const ThemeIcon = { dark: Moon, light: Sun, system: Monitor }[mode];

  // Build display user
  const displayUser = user
    ? {
        name: user.userProfile?.name || user.username || "User",
        avatar: user.userProfile?.avatar || user.picture || "",
        role: user.userProfile?.role || "STUDENT",
        email: user.email,
      }
    : null;

  const roleConfig = displayUser ? ROLE_CONFIG[displayUser.role as UserRole] : null;
  const RoleIcon = roleConfig?.icon || GraduationCap;

  // Determine nav links based on auth state
  const navLinks = isAuthenticated && displayUser?.role
    ? ROLE_NAV_LINKS[displayUser.role as UserRole] || PUBLIC_LINKS
    : PUBLIC_LINKS;

  const handleLogoutClick = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <>
      <motion.header
        style={{
          backgroundColor,
          borderBottomColor: borderColor,
          backdropFilter,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push(isAuthenticated ? `/${displayUser?.role.toLowerCase().replace("_", "-")}` : "/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-foreground leading-tight tracking-tight">
                  Quentrax
                </span>
                <span className="text-[10px] text-muted-foreground leading-none tracking-wider">
                  by Genzzi
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  link={link}
                  isActive={isActive(link.href)}
                />
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Picker */}
              <div className="relative">
                <motion.button
                  ref={themeButtonRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Change theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ThemeIcon className="w-4 h-4" />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {showThemeMenu && (
                    <motion.div
                      ref={themeMenuRef}
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-40 bg-background border border-border rounded-xl shadow-xl p-1 z-50"
                    >
                      {(
                        [
                          { value: "light" as const, label: "Light", icon: Sun },
                          { value: "dark" as const, label: "Dark", icon: Moon },
                          { value: "system" as const, label: "System", icon: Monitor },
                        ] as const
                      ).map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTheme(option.value);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            mode === option.value
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

              <div className="w-px h-6 bg-border" />

              {/* Auth Section */}
              {isLoading ? (
                <div className="w-32 h-9 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated && displayUser && roleConfig ? (
                <div className="relative">
                  <motion.button
                    ref={userButtonRef}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-border/50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {displayUser.avatar ? (
                        <Image
                          src={displayUser.avatar}
                          alt={displayUser.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {displayUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    </div>

                    {/* Name & Role */}
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-sm font-semibold text-foreground">
                        {displayUser.name}
                      </span>
                      <span className={`text-[10px] font-medium ${roleConfig.color}`}>
                        {displayUser.role.replace("_", " ")}
                      </span>
                    </div>

                    <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        ref={userMenuRef}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-14 w-64 bg-background border border-border rounded-2xl shadow-2xl p-3 z-50 overflow-hidden"
                      >
                        {/* Header with gradient */}
                        <div className={`relative px-4 py-4 -mx-3 -mt-3 mb-3 ${roleConfig.bg} border-b ${roleConfig.border}`}>
                          <div className="flex items-center gap-3">
                            {displayUser.avatar ? (
                              <Image
                                src={displayUser.avatar}
                                alt={displayUser.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-lg font-bold text-primary">
                                  {displayUser.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-foreground">{displayUser.name}</p>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleConfig.bg} ${roleConfig.color} ${roleConfig.border} border`}>
                                <RoleIcon className="w-3 h-3" />
                                {displayUser.role.replace("_", " ")}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground truncate">
                            {displayUser.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              router.push(`/${displayUser.role.toLowerCase().replace("_", "-")}`);
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>

                          <button
                            onClick={() => {
                              router.push("/profile");
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </button>

                          <div className="h-px bg-border my-1" />

                          <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <GenzziButton
                  variant={isDark ? "dark" : "light"}
                  oauthConfig={{
                    client_id: client_id ?? "your-client-id",
                  }}
                >
                  Sign With Genzzi
                </GenzziButton>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
                  setTheme(nextMode);
                }}
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
              >
                {mode === "dark" && <Moon className="w-4 h-4" />}
                {mode === "light" && <Sun className="w-4 h-4" />}
                {mode === "system" && <Monitor className="w-4 h-4" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-background border-l border-border z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-foreground">Menu</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* User Card (if authenticated) */}
              {isAuthenticated && displayUser && roleConfig && (
                <div className={`p-4 border-b ${roleConfig.border} ${roleConfig.bg}`}>
                  <div className="flex items-center gap-3">
                    {displayUser.avatar ? (
                      <Image
                        src={displayUser.avatar}
                        alt={displayUser.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {displayUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground">{displayUser.name}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleConfig.bg} ${roleConfig.color} border ${roleConfig.border}`}>
                        <RoleIcon className="w-3 h-3" />
                        {displayUser.role.replace("_", " ")}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{displayUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {navLinks.map((link, i) => (
                  <MobileNavItem
                    key={link.href}
                    link={link}
                    isActive={isActive(link.href)}
                    onClick={() => router.push(link.href)}
                    index={i}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border space-y-2">
                {isLoading ? (
                  <div className="w-full h-12 rounded-xl bg-muted animate-pulse" />
                ) : isAuthenticated ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        router.push(`/${displayUser?.role.toLowerCase().replace("_", "-")}`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-3 rounded-xl border border-destructive/20 text-destructive font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <GenzziButton
                    className="w-full"
                    variant={isDark ? "dark" : "light"}
                    oauthConfig={{ client_id: client_id ?? "your-client-id" }}
                  >
                    Sign With Genzzi
                  </GenzziButton>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}