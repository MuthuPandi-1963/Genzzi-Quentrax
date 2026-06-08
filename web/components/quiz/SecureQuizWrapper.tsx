"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Expand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecureQuizWrapper({ children, maxViolations = 3, onAutoSubmit }: { children: React.ReactNode, maxViolations?: number, onAutoSubmit?: () => void }) {
  const [warningCount, setWarningCount] = useState(0);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  useEffect(() => {
    // Disable Right Click
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      showWarning("Right click is disabled during the exam.");
    };

    document.addEventListener("contextmenu", disableRightClick);

    // Disable Copy/Paste
    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning("Copy/Paste is disabled during the exam.");
    };

    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    // Disable Keyboard Shortcuts
    const disableShortcuts = (e: KeyboardEvent) => {
      // Ctrl+C, V, X, etc.
      if (e.ctrlKey && ["c", "v", "x", "u", "s", "p", "a"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Alt + Tab (limited browser prevention, but we can try)
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
      }
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl+Shift+I/J/C
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", disableShortcuts);

    // Detect Tab Switching
    const handleVisibility = () => {
      if (document.hidden) {
        handleViolation("TAB_SWITCH", "Tab switching detected!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Fullscreen Enforcement
    const enterFullscreen = async () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        try {
          await elem.requestFullscreen();
        } catch (err) {
          console.error("Error attempting to enable full-screen mode:", err);
        }
      }
    };

    // Need to trigger on first interaction since we can't auto-fullscreen without user gesture
    const handleFirstInteraction = () => {
      enterFullscreen();
      document.removeEventListener("click", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);

    const fullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation("EXIT_FULLSCREEN", "Fullscreen mode is required!");
        // We can't automatically re-enter without gesture, but we log the violation
      }
    };

    document.addEventListener("fullscreenchange", fullscreenChange);

    // DevTools Detection
    const detectDevTools = setInterval(() => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        handleViolation("DEVTOOLS_OPENED", "Developer tools detected!");
      }
    }, 2000);

    // Detect Browser Refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", fullscreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleFirstInteraction);
      clearInterval(detectDevTools);
    };
  }, []);

  const showWarning = (message: string) => {
    setLastWarning(message);
    setTimeout(() => setLastWarning(null), 3000);
  };

  const handleViolation = (type: string, message: string) => {
    setWarningCount((prev) => {
      const newCount = prev + 1;
      showWarning(`${message} (Warning ${newCount}/${maxViolations})`);
      
      // Log to API
      fetch("/api/track-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, timestamp: new Date() }),
      }).catch(console.error);

      if (newCount >= maxViolations && onAutoSubmit) {
        alert("Exam auto-submitted due to excessive violations.");
        onAutoSubmit();
      }
      return newCount;
    });
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0A10] flex flex-col relative select-none">
      {/* Violation Banner */}
      <div className={`h-10 px-4 flex items-center justify-between text-sm font-bold text-white transition-colors ${warningCount > 0 ? 'bg-red-600' : 'bg-emerald-600'}`}>
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-4 h-4" />
          <span>Proctored Environment Active</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={requestFullscreen} className="flex items-center gap-1 hover:text-white/80 transition-colors">
            <Expand className="w-4 h-4" />
            <span>Fullscreen</span>
          </button>
          <span className="bg-white/20 px-2 py-0.5 rounded">
            Violations: {warningCount} / {maxViolations}
          </span>
        </div>
      </div>

      {/* Floating Warning Toast */}
      <AnimatePresence>
        {lastWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-12 left-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-medium border border-red-400"
          >
            <AlertTriangle className="w-5 h-5" />
            {lastWarning}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
