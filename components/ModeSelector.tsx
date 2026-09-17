"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type GameMode } from "@/types";

interface ModeSelectorProps {
  levelTitle: string;
  levelEmoji: string;
  isOpen: boolean;
  onSelect: (mode: GameMode) => void;
  onClose: () => void;
}

const MODES = [
  {
    id: "normal" as GameMode,
    icon: "📚",
    title: "Mode Normal",
    desc: "Santai tanpa tekanan waktu. Cocok untuk belajar serius.",
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    badge: null,
    stars: 1,
  },
  {
    id: "speed" as GameMode,
    icon: "⚡",
    title: "Speed Run",
    desc: "Cocokkan semua kata sebelum 60 detik habis!",
    gradient: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/20",
    badge: "60 detik",
    stars: 2,
  },
  {
    id: "listening" as GameMode,
    icon: "🎧",
    title: "Listening",
    desc: "Dengarkan kata, pilih arti yang tepat. Latih pendengaranmu!",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    badge: null,
    stars: 2,
  },
  {
    id: "typing" as GameMode,
    icon: "⌨️",
    title: "Typing (Hardcore)",
    desc: "Ketik terjemahannya tanpa pilihan ganda. Level tertinggi!",
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    badge: "Hardcore",
    stars: 3,
  },
];

export default function ModeSelector({ levelTitle, levelEmoji, isOpen, onSelect, onClose }: ModeSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <div className="w-full max-w-md bg-white dark:bg-[#0F1629] rounded-t-[2rem] px-5 pt-4 pb-10 shadow-2xl">
              {/* Handle */}
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600/60 rounded-full mx-auto mb-5" />

              {/* Level info */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/40">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-2xl shadow-md shadow-indigo-500/20 shrink-0">
                  {levelEmoji}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Level Dipilih
                  </p>
                  <h3 className="font-black text-base text-slate-800 dark:text-white leading-tight" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    {levelTitle}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">
                Pilih mode bermain:
              </p>

              <div className="flex flex-col gap-2.5">
                {MODES.map((mode, i) => (
                  <motion.button
                    key={mode.id}
                    id={`mode-select-${mode.id}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(mode.id)}
                    className={`relative flex items-center gap-4 p-4 rounded-2xl text-left overflow-hidden shadow-lg ${mode.glow}`}
                  >
                    {/* Gradient bg */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${mode.gradient} opacity-90`} />
                    {/* Shimmer for speed mode */}
                    {mode.id === "speed" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    {/* Decorative circle */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />

                    <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0">
                      {mode.icon}
                    </div>

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-sm text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                          {mode.title}
                        </p>
                        {mode.badge && (
                          <span className="text-[9px] font-black bg-white/25 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            {mode.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/75 text-xs font-medium leading-snug">{mode.desc}</p>
                    </div>

                    {/* Stars earned indicator */}
                    <div className="relative z-10 flex gap-0.5 shrink-0">
                      {[1, 2, 3].map(s => (
                        <span key={s} className={`text-xs ${s <= mode.stars ? "opacity-100" : "opacity-25"}`}>⭐</span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
