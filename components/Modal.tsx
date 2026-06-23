"use client";

import { motion, AnimatePresence } from "framer-motion";
import MrCece from "./MrCece";
import { type MrCeceExpression } from "./MrCece";

interface ModalProps {
  isOpen: boolean;
  type: "gameover" | "levelcomplete";
  levelTitle?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

const configs = {
  gameover: {
    expression: "sad" as MrCeceExpression,
    bg: "from-red-50 to-rose-100",
    border: "border-red-300",
    titleColor: "text-red-600",
    title: "Oh no! 💔",
    subtitle: "You ran out of hearts! Don't give up, Mr. Cece believes in you!",
    primaryLabel: "Try Again 🔄",
    primaryClass: "bg-blue-500 border-blue-700 text-white hover:bg-blue-600",
    secondaryLabel: "Choose Level",
  },
  levelcomplete: {
    expression: "excited" as MrCeceExpression,
    bg: "from-green-50 to-emerald-100",
    border: "border-green-300",
    titleColor: "text-green-600",
    title: "Level Complete! 🎉",
    subtitle: "Amazing work! You matched all the words like a pro!",
    primaryLabel: "Next Level →",
    primaryClass: "bg-green-500 border-green-700 text-white hover:bg-green-600",
    secondaryLabel: "Choose Level",
  },
};

export default function Modal({ isOpen, type, levelTitle, onPrimary, onSecondary }: ModalProps) {
  const cfg = configs[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`
                w-full max-w-sm rounded-3xl border-2 border-b-[6px] p-8
                bg-gradient-to-b ${cfg.bg} ${cfg.border}
                flex flex-col items-center gap-4 text-center shadow-2xl
              `}
              initial={{ scale: 0.5, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {/* Confetti burst for level complete */}
              {type === "levelcomplete" && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 8 + Math.random() * 10,
                        height: 8 + Math.random() * 10,
                        background: ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"][i % 5],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        border: "2px solid rgba(0,0,0,0.2)",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 1, 0],
                        y: [-20, -80 - Math.random() * 60],
                        x: [(Math.random() - 0.5) * 40],
                        rotate: Math.random() * 360,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              <MrCece expression={cfg.expression} size={110} />

              {levelTitle && (
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white/60 px-3 py-1 rounded-full border border-slate-200">
                  {levelTitle}
                </span>
              )}

              <h2 className={`text-3xl font-black ${cfg.titleColor}`}>{cfg.title}</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{cfg.subtitle}</p>

              <div className="flex flex-col gap-3 w-full mt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onPrimary}
                  className={`
                    w-full py-3.5 rounded-2xl font-black text-base
                    border-2 border-b-[6px] active:border-b-[2px] active:translate-y-[4px]
                    transition-all duration-100 ${cfg.primaryClass}
                  `}
                >
                  {cfg.primaryLabel}
                </motion.button>

                {onSecondary && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSecondary}
                    className="w-full py-3 rounded-2xl font-bold text-sm text-slate-600
                      border-2 border-b-[4px] border-slate-300 bg-white
                      active:border-b-[2px] active:translate-y-[2px] transition-all duration-100
                      hover:bg-slate-50"
                  >
                    {cfg.secondaryLabel}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
