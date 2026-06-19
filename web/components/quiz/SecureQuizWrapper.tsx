"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { AlertTriangle, Expand, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SecurityEventService } from "@/providers/services/security-event.service";
import { SecurityConstants, ViolationType } from "@/providers/services/Security.constants";

interface SecureQuizWrapperProps {
  children: React.ReactNode;
  maxViolations?: number;
  onAutoSubmit?: () => void;
  quizId?: string;
  sessionId?: string;
  userId?: string;
}

export default function SecureQuizWrapper({
  children,
  maxViolations = 3,
  onAutoSubmit,
  quizId,
  sessionId,
  userId,
}: SecureQuizWrapperProps) {
  const [warningCount, setWarningCount] = useState(0);
  const [lastWarning, setLastWarning] = useState<string | null>(null);
  const [violations, setViolations] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationTimerRef = useRef<NodeJS.Timeout>();
  const eventServiceRef = useRef<SecurityEventService | null>(null);

  // Initialize security event service
  useEffect(() => {
    eventServiceRef.current = new SecurityEventService({
      quizId: quizId || "unknown",
      sessionId: sessionId || `temp_${Date.now()}`,
      userId: userId || "anonymous",
    });
  }, [quizId, sessionId, userId]);

  useEffect(() => {
    const eventService = eventServiceRef.current;
    if (!eventService) return;

    // ────────────────────────────────────────────────────────────────
    // VIOLATION HANDLERS
    // ────────────────────────────────────────────────────────────────

    const handleViolation = async (type: ViolationType, message: string) => {
      setWarningCount((prevCount) => {
        const newCount = prevCount + 1;
        
        const violation = {
          type,
          timestamp: new Date(),
          count: newCount,
          message,
        };

        setViolations((prev) => [...prev, violation]);
        showWarning(`${message} (Warning ${newCount}/${maxViolations})`);

        // Track violation in real-time
        eventService.trackViolation(type, message);

        // Auto-submit if threshold reached
        if (newCount >= maxViolations && onAutoSubmit) {
          alert("Exam auto-submitted due to excessive violations.");
          eventService.trackAutoSubmit(violations);
          onAutoSubmit();
        }

        return newCount;
      });
    };

    // ────────────────────────────────────────────────────────────────
    // FULLSCREEN ENFORCEMENT
    // ────────────────────────────────────────────────────────────────

    const enforceFullscreen = async () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen && !document.fullscreenElement) {
        try {
          await elem.requestFullscreen();
          setIsFullscreen(true);
        } catch (err) {
          console.error("Fullscreen request failed:", err);
          handleViolation(
            ViolationType.FULLSCREEN_DENIED,
            "Fullscreen mode required for exam"
          );
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        handleViolation(
          ViolationType.EXIT_FULLSCREEN,
          "You exited fullscreen mode"
        );
        // Attempt to re-enter fullscreen
        setTimeout(() => enforceFullscreen(), 500);
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Trigger fullscreen on first interaction
    const handleFirstInteraction = async () => {
      await enforceFullscreen();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("keydown", handleFirstInteraction, { once: true });

    // ────────────────────────────────────────────────────────────────
    // RIGHT-CLICK PREVENTION
    // ────────────────────────────────────────────────────────────────

    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      handleViolation(
        ViolationType.RIGHT_CLICK,
        "Right-click is disabled during the exam"
      );
    };

    document.addEventListener("contextmenu", disableRightClick);

    // ────────────────────────────────────────────────────────────────
    // COPY/PASTE PREVENTION
    // ────────────────────────────────────────────────────────────────

    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation(
        ViolationType.COPY_PASTE,
        "Copy/Paste is disabled during the exam"
      );
    };

    document.addEventListener("copy", disableCopyPaste);
    document.addEventListener("cut", disableCopyPaste);
    document.addEventListener("paste", disableCopyPaste);

    // ────────────────────────────────────────────────────────────────
    // KEYBOARD SHORTCUT PREVENTION
    // ────────────────────────────────────────────────────────────────

    const disableShortcuts = (e: KeyboardEvent) => {
      const shortcutsToBlock = [
        { keys: ["c", "v", "x", "u", "s", "p", "a"], ctrl: true, name: "Copy/Paste shortcuts" },
        { keys: ["I", "J", "C"], ctrl: true, shift: true, name: "DevTools shortcuts" },
      ];

      for (const shortcut of shortcutsToBlock) {
        if (
          e.ctrlKey === shortcut.ctrl &&
          e.shiftKey === shortcut.shift &&
          shortcut.keys.includes(e.key)
        ) {
          e.preventDefault();
          handleViolation(
            ViolationType.KEYBOARD_SHORTCUT,
            `${shortcut.name} blocked`
          );
          return;
        }
      }

      // F12 - DevTools
      if (e.key === "F12") {
        e.preventDefault();
        handleViolation(
          ViolationType.DEVTOOLS_SHORTCUT,
          "DevTools access blocked (F12)"
        );
      }

      // Ctrl+Shift+K - DevTools console
      if (e.ctrlKey && e.shiftKey && e.key === "k") {
        e.preventDefault();
        handleViolation(
          ViolationType.DEVTOOLS_SHORTCUT,
          "DevTools access blocked (Ctrl+Shift+K)"
        );
      }
    };

    document.addEventListener("keydown", disableShortcuts);

    // ────────────────────────────────────────────────────────────────
    // TAB SWITCHING DETECTION
    // ────────────────────────────────────────────────────────────────

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation(
          ViolationType.TAB_SWITCH,
          "Tab switching detected during exam"
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ────────────────────────────────────────────────────────────────
    // DEVTOOLS DETECTION (ENHANCED)
    // ────────────────────────────────────────────────────────────────

    const detectDevTools = setInterval(() => {
      const threshold = SecurityConstants.DEVTOOLS_THRESHOLD;

      // Method 1: Window size detection
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        handleViolation(
          ViolationType.DEVTOOLS_OPENED,
          "Developer tools detected"
        );
      }

      // Method 2: Performance API check
      if (performance.memory) {
        const memUsage =
          (performance.memory.usedJSHeapSize /
            performance.memory.jsHeapSizeLimit) *
          100;
        if (memUsage > SecurityConstants.MEMORY_THRESHOLD) {
          console.warn("Unusual memory usage detected:", memUsage);
        }
      }
    }, SecurityConstants.DETECTION_INTERVAL);

    // ────────────────────────────────────────────────────────────────
    // PAGE REFRESH/NAVIGATION PREVENTION
    // ────────────────────────────────────────────────────────────────

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      handleViolation(
        ViolationType.PAGE_REFRESH,
        "Page refresh attempt blocked"
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // ────────────────────────────────────────────────────────────────
    // POINTER/FOCUS LOCK (Optional enhanced security)
    // ────────────────────────────────────────────────────────────────

    const handlePointerLock = () => {
      const elem = document.documentElement as any;
      if (elem.requestPointerLock && !document.pointerLockElement) {
        try {
          elem.requestPointerLock();
        } catch (err) {
          console.error("Pointer lock failed:", err);
        }
      }
    };

    document.addEventListener("mousemove", handlePointerLock, { once: true });

    // ────────────────────────────────────────────────────────────────
    // CLEANUP
    // ────────────────────────────────────────────────────────────────

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopyPaste);
      document.removeEventListener("cut", disableCopyPaste);
      document.removeEventListener("paste", disableCopyPaste);
      document.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("mousemove", handlePointerLock);
      clearInterval(detectDevTools);
      if (violationTimerRef.current) clearTimeout(violationTimerRef.current);

      // Final event submission
      if (eventService && violations.length > 0) {
        eventService.submitViolationReport(violations);
      }
    };
  }, [maxViolations, onAutoSubmit, violations]);

  const showWarning = (message: string) => {
    setLastWarning(message);
    if (violationTimerRef.current) clearTimeout(violationTimerRef.current);
    violationTimerRef.current = setTimeout(
      () => setLastWarning(null),
      SecurityConstants.WARNING_DISPLAY_DURATION
    );
  };

  const requestFullscreen = () => {
    const elem = document.documentElement as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0A10] flex flex-col relative select-none">
      {/* Status Banner */}
      <div
        className={`h-10 px-4 flex items-center justify-between text-sm font-bold text-white transition-colors ${
          warningCount > 0 ? "bg-red-600" : "bg-emerald-600"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldIcon className="w-4 h-4" />
          <span>Proctored Environment Active</span>
          {isFullscreen && <Lock className="w-3 h-3 ml-2" />}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={requestFullscreen}
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
          >
            <Expand className="w-4 h-4" />
            <span>Fullscreen</span>
          </button>
          <span className="bg-white/20 px-2 py-0.5 rounded">
            Violations: {warningCount} / {maxViolations}
          </span>
        </div>
      </div>

      {/* Violation Toast */}
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

      {/* Content Area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}