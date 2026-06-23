"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

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
        border: "2px solid black",
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

const stateStyles: Record<ButtonState, string> = {
  idle: "bg-white border-black hover:bg-blue-50 active:border-b-[2px] active:translate-y-[4px] cursor-pointer",
  selected: "bg-blue-100 border-blue-600 border-b-[6px] scale-[0.97] cursor-pointer",
  correct: "bg-green-400 border-green-700 border-b-[2px] translate-y-[4px] cursor-default opacity-80",
  incorrect: "bg-red-400 border-red-700 border-b-[6px] cursor-default",
};

const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [-6, 6, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function WordButton({ word, lang, state, disabled, onClick }: WordButtonProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [shake, setShake] = useState(false);

  const prevState = useCallback((ps: ButtonState, ns: ButtonState) => {
    if (ns === "correct" && ps !== "correct") return "correct";
    if (ns === "incorrect" && ps !== "incorrect") return "incorrect";
    return null;
  }, []);

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

  return (
    <div className="relative">
      {/* Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={disabled ? undefined : onClick}
        variants={shakeVariants}
        animate={shake ? "shake" : "idle"}
        whileHover={!disabled && state === "idle" ? { scale: 1.03 } : {}}
        whileTap={!disabled && state === "idle" ? { scale: 0.97 } : {}}
        className={`
          relative w-full px-4 py-3 rounded-2xl font-bold text-sm
          border-2 border-b-[6px] transition-all duration-100
          text-slate-800 shadow-sm
          ${stateStyles[state]}
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

        <span className="block pr-5">{word}</span>

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
