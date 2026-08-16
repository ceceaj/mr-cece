"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type ButtonState = "idle" | "selected" | "correct" | "incorrect";

interface WordButtonProps {
  word: string;
  lang: "en" | "id";
  state: ButtonState;
  disabled?: boolean;
  onClick: () => void;
}

// Floating particle for correct answer
function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 40 + Math.random() * 40;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none z-50"
      style={{
        width: 8 + Math.random() * 8,
        height: 8 + Math.random() * 8,
        background: color,
        left: x,
        top: y,
        border: "2px solid rgba(0,0,0,0.3)",
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    />
  );
}

// Dark-mode-aware state styles using data attributes instead of stateStyles map
function getStateClass(state: ButtonState): string {
  switch (state) {
    case "idle":
      return "bg-white dark:bg-gray-700 border-slate-800 dark:border-gray-500 text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:border-blue-600 dark:hover:border-blue-400 active:border-b-[2px] active:translate-y-[4px] cursor-pointer";
    case "selected":
      return "bg-blue-100 dark:bg-blue-900/60 border-blue-600 dark:border-blue-400 border-b-[6px] scale-[0.97] cursor-pointer text-blue-900 dark:text-blue-100";
    case "correct":
      return "bg-green-400 dark:bg-green-600 border-green-700 dark:border-green-800 border-b-[2px] translate-y-[4px] cursor-default opacity-80 text-white";
    case "incorrect":
      return "bg-red-400 dark:bg-red-600 border-red-700 dark:border-red-800 border-b-[6px] cursor-default text-white";
  }
}

export default function WordButton({ word, lang, state, disabled, onClick }: WordButtonProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (state === "correct") {
      const colors = ["#34D399", "#FCD34D", "#60A5FA", "#F9A8D4", "#A78BFA"];
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 60 + 20,
        y: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      const t = setTimeout(() => setParticles([]), 800);
      return () => clearTimeout(t);
    }
    if (state === "incorrect") {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [state]);

  const shakeAnimate = shake
    ? { x: ([-6, 6, -6, 6, -4, 4, -2, 2, 0] as number[]) }
    : { x: 0 as number };

  return (
    <div className="relative h-full">
      {/* Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={disabled ? undefined : onClick}
        animate={shakeAnimate}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={!disabled && state === "idle" ? { scale: 1.03 } : {}}
        whileTap={!disabled && state === "idle" ? { scale: 0.97 } : {}}
        className={`
          relative w-full h-full px-3 py-2 rounded-2xl font-bold text-sm
          border-2 border-b-[6px] transition-colors duration-100
          shadow-sm
          ${getStateClass(state)}
          ${disabled ? "pointer-events-none" : ""}
        `}
      >
        {/* Lang badge */}
        <span
          className={`
            absolute top-1 right-1.5 text-[9px] font-black rounded-full px-1.5 py-0.5 uppercase tracking-wider
            ${lang === "en" ? "bg-blue-500 text-white" : "bg-amber-400 text-black"}
          `}
        >
          {lang === "en" ? "EN" : "ID"}
        </span>

        <span className="block pr-5 text-left leading-tight">{word}</span>

        {/* Correct checkmark */}
        <AnimatePresence>
          {state === "correct" && (
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-2xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              ✅
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
