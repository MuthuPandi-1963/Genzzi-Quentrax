"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type ThemeMode = "dark" | "light" | "system";

interface ThemeContextValue {
  /** Current resolved theme (always dark or light) */
  theme: "dark" | "light";
  /** User's selected mode (dark/light/system) */
  mode: ThemeMode;
  /** Whether the theme has been resolved from system/localStorage (avoids hydration flicker) */
  resolved: boolean;
  /** Set a specific mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between dark/light directly */
  toggleTheme: () => void;
  /** True if currently dark */
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "quentrax-theme";
const THEME_ATTR = "data-theme";

/* ─── Helpers ─────────────────────────────────────────────── */

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && ["dark", "light", "system"].includes(stored)) return stored;
  } catch {
    // localStorage blocked (private mode)
  }
  return "system";
}

/* ─── Provider ──────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState(false);

  // Resolve actual theme from mode
  const theme: "dark" | "light" =
    mode === "system" ? (resolved ? getSystemTheme() : "light") : mode;

  const isDark = theme === "dark";

  // Apply to <html> and CSS variables
  const applyTheme = useCallback((nextTheme: "dark" | "light") => {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTR, nextTheme);

    // Optional: sync CSS variables for your glassmorphism design
    if (nextTheme === "dark") {
      root.style.setProperty("--color-background", "#110c1c");
      root.style.setProperty("--color-background-elevated", "#1a1429");
      root.style.setProperty("--color-foreground", "#ffffff");
      root.style.setProperty("--color-foreground-muted", "rgba(255,255,255,0.6)");
      root.style.setProperty("--color-foreground-subtle", "rgba(255,255,255,0.4)");
      root.style.setProperty("--color-muted", "rgba(255,255,255,0.08)");
      root.style.setProperty("--color-border", "rgba(255,255,255,0.1)");
      root.style.setProperty("--color-primary", "#8b5cf6");   // violet-500
      root.style.setProperty("--color-accent", "#d946ef");    // fuchsia-500
    } else {
      root.style.setProperty("--color-background", "#f8f7fc");
      root.style.setProperty("--color-background-elevated", "#ffffff");
      root.style.setProperty("--color-foreground", "#1a1429");
      root.style.setProperty("--color-foreground-muted", "rgba(26,20,41,0.6)");
      root.style.setProperty("--color-foreground-subtle", "rgba(26,20,41,0.4)");
      root.style.setProperty("--color-muted", "rgba(26,20,41,0.06)");
      root.style.setProperty("--color-border", "rgba(26,20,41,0.1)");
      root.style.setProperty("--color-primary", "#7c3aed");   // violet-600
      root.style.setProperty("--color-accent", "#c026d3");    // fuchsia-600
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialMode = getInitialMode();
    setModeState(initialMode);

    const initialTheme =
      initialMode === "system" ? getSystemTheme() : initialMode;
    applyTheme(initialTheme);
    setResolved(true);

    // Listen for system changes
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (mode === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [applyTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply when mode changes
  useEffect(() => {
    if (!resolved) return;
    const next = mode === "system" ? getSystemTheme() : mode;
    applyTheme(next);
  }, [mode, resolved, applyTheme]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setMode(theme === "dark" ? "light" : "dark");
  }, [setMode, theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, mode, resolved, setMode, toggleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────── */

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
