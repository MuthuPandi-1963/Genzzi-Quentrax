"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  Home,
  Info,
  HelpCircle,
  Mail,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// Mock user data - replace with your actual auth logic
const useAuth = () => {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Replace with your real auth check
    const mockUser = null; // Set to { name: "John", avatar: "/avatar.jpg" } to test logged in state
    setUser(mockUser);
    setIsAuthenticated(!!mockUser);
  }, []);

  return { user, isAuthenticated };
};

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: Mail },
];

function MobileNavItem({
  link,
  isActive,
  onClick,
  index,
}: {
  link: (typeof navLinks)[0];
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
  link: (typeof navLinks)[0];
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
          className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mode = (theme as "dark" | "light" | "system") || "system";
  const setMode = setTheme;
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();

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

  const ThemeIcon = {
    dark: Moon,
    light: Sun,
    system: Monitor,
  }[mode];

  return (
    <>
      <motion.header
        style={{
          backgroundColor: navBackground,
          backdropFilter: navBackdrop,
          borderBottomColor: navBorder,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50"
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
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-foreground leading-tight tracking-tight">
                  Quentrax
                </span>
                <span className="text-[10px] text-muted-foreground/70 leading-none tracking-wider uppercase">
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-40 bg-popover border border-border rounded-xl shadow-xl p-1 z-50"
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

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2"
                >
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/signup")}
                    className="bg-gradient-to-r from-primary to-accent px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 text-white shadow-md shadow-primary/25"
                  >
                    <UserPlus className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Theme Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
                  setMode(nextMode);
                }}
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
              >
                {mode === "dark" && <Moon className="w-4 h-4" />}
                {mode === "light" && <Sun className="w-4 h-4" />}
                {mode === "system" && <Monitor className="w-4 h-4" />}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground"
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
              className="fixed inset-0 bg-background/80 backdrop-blur-xl z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-background border-l border-border z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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

              {/* User Info (if authenticated) */}
              {isAuthenticated && user && (
                <div className="p-4 border-b border-border flex items-center gap-3">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
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

              {/* Menu Footer - Auth Actions */}
              <div className="p-4 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/profile")}
                      className="w-full border border-border px-4 py-3 rounded-xl text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Add your logout logic here
                        router.push("/logout");
                      }}
                      className="w-full border border-destructive/20 px-4 py-3 rounded-xl text-destructive font-medium flex items-center justify-center gap-2"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/login")}
                      className="w-full border border-border px-4 py-3 rounded-xl text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/signup")}
                      className="w-full bg-gradient-to-r from-primary to-accent px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white shadow-md shadow-primary/25"
                    >
                      <UserPlus className="w-4 h-4" />
                      Get Started
                    </motion.button>
                  </>
                )}
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