"use client";

import { motion, AnimatePresence } from "framer-motion";

export type MrCeceExpression = "idle" | "happy" | "sad" | "excited" | "thinking";

interface MrCeceProps {
  expression?: MrCeceExpression;
  size?: number;
  className?: string;
}

const expressions: Record<MrCeceExpression, {
  eyeLeft: string;
  eyeRight: string;
  mouth: string;
  eyebrowLeft?: string;
  eyebrowRight?: string;
  cheeks?: boolean;
}> = {
  idle: {
    eyeLeft: "M 32 38 A 5 5 0 1 1 42 38",
    eyeRight: "M 58 38 A 5 5 0 1 1 68 38",
    mouth: "M 35 58 Q 50 65 65 58",
  },
  happy: {
    eyeLeft: "M 30 40 Q 37 30 44 40",
    eyeRight: "M 56 40 Q 63 30 70 40",
    mouth: "M 32 56 Q 50 72 68 56",
    cheeks: true,
  },
  sad: {
    eyeLeft: "M 32 38 A 5 5 0 1 1 42 38",
    eyeRight: "M 58 38 A 5 5 0 1 1 68 38",
    mouth: "M 35 65 Q 50 52 65 65",
    eyebrowLeft: "M 30 28 Q 37 24 44 28",
    eyebrowRight: "M 56 28 Q 63 24 70 28",
  },
  excited: {
    eyeLeft: "M 30 40 Q 37 28 44 40",
    eyeRight: "M 56 40 Q 63 28 70 40",
    mouth: "M 30 54 Q 50 74 70 54",
    cheeks: true,
  },
  thinking: {
    eyeLeft: "M 32 38 A 5 5 0 1 1 42 38",
    eyeRight: "M 58 35 A 5 5 0 1 1 68 35",
    mouth: "M 38 62 Q 50 58 60 62",
    eyebrowLeft: "M 30 26 Q 37 22 44 26",
    eyebrowRight: "M 56 24 Q 63 20 70 24",
  },
};

export default function MrCece({ expression = "idle", size = 120, className = "" }: MrCeceProps) {
  const expr = expressions[expression];

  const bounceAnim = expression === "happy" || expression === "excited"
    ? { y: [0, -8, 0], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" as const } }
    : expression === "sad"
    ? { rotate: [0, -3, 3, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const } }
    : { y: [0, -3, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const } };

  return (
    <motion.div
      className={`inline-block select-none ${className}`}
      animate={bounceAnim}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="108" rx="28" ry="4" fill="rgba(0,0,0,0.12)" />

        {/* Body (graduation cap style hat area) */}
        <rect x="20" y="8" width="60" height="8" rx="3" fill="#1E293B" />
        <rect x="38" y="2" width="24" height="10" rx="2" fill="#1E293B" />
        <circle cx="62" cy="8" r="3" fill="#FBBF24" />

        {/* Head */}
        <circle cx="50" cy="55" r="35" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />

        {/* Cheeks */}
        <AnimatePresence>
          {expr.cheeks && (
            <>
              <motion.circle
                key="cheek-left"
                cx="28" cy="58" r="8"
                fill="#FCA5A5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
              <motion.circle
                key="cheek-right"
                cx="72" cy="58" r="8"
                fill="#FCA5A5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Eyebrows */}
        <AnimatePresence>
          {expr.eyebrowLeft && (
            <motion.path
              key="brow-l"
              d={expr.eyebrowLeft}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          {expr.eyebrowRight && (
            <motion.path
              key="brow-r"
              d={expr.eyebrowRight}
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Eyes */}
        <motion.path
          key={`eye-l-${expression}`}
          d={expr.eyeLeft}
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill={expression === "happy" || expression === "excited" ? "none" : "#1E293B"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          key={`eye-r-${expression}`}
          d={expr.eyeRight}
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill={expression === "happy" || expression === "excited" ? "none" : "#1E293B"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Pupils (only on non-squint eyes) */}
        {(expression === "idle" || expression === "thinking") && (
          <>
            <circle cx="37" cy="36" r="2" fill="white" />
            <circle cx="63" cy="36" r="2" fill="white" />
          </>
        )}

        {/* Mouth */}
        <motion.path
          key={`mouth-${expression}`}
          d={expr.mouth}
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill={expression === "happy" || expression === "excited" ? "#FCA5A5" : "none"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Bowtie */}
        <path d="M 38 80 L 46 76 L 46 84 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M 62 80 L 54 76 L 54 84 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.5" />
        <circle cx="50" cy="80" r="3" fill="#2563EB" stroke="#1E293B" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}
