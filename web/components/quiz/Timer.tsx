"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  minutes: number;
  onExpire: () => void;
}

export default function Timer({ minutes, onExpire }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const isWarning = secondsLeft < 60; // less than 1 minute

  return (
    <div className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-1.5 rounded-full border ${
      isWarning 
        ? "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/30" 
        : "bg-white dark:bg-white/10 text-gray-900 dark:text-white border-black/10 dark:border-white/20"
    }`}>
      <Clock className={`w-5 h-5 ${isWarning ? "animate-pulse" : ""}`} />
      <span>{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}</span>
    </div>
  );
}
