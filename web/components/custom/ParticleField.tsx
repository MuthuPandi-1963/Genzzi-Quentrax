// components/ParticleField.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() =>{ (async()=>{setMounted(true)})()}, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 24 }).map((_, i) => {
        const left  = seededRand(i + 1) * 100;
        const top   = seededRand(i + 101) * 100;
        const size  = seededRand(i + 201) * 4 + 2;
        const dur   = seededRand(i + 301) * 8 + 6;
        const delay = seededRand(i + 401) * 4;
        const xOff  = seededRand(i + 501) * 30 - 15;
        const isGold = i % 5 === 0;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: isGold ? "hsl(45 95% 55%)" : "hsl(263 70% 58%)",
            }}
            animate={{ y: [0, -40, 0], x: [0, xOff, 0], opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}