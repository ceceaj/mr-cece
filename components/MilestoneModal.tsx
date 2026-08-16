"use client";

import { motion, AnimatePresence } from "framer-motion";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

interface MilestoneModalProps {
  cefr: CefrLevel | null;
  onClose: () => void;
}

const MILESTONE_CONFIG: Record<CefrLevel, {
  emoji: string;
  badge: string;
  title: string;
  subtitle: string;
  nextHint: string;
  gradient: string;
  border: string;
  btnClass: string;
}> = {
  A1: {
    emoji: "🥈",
    badge: "Master A1",
    title: "A1 Takluk!",
    subtitle: "Kamu sudah menguasai 112 kata Oxford level A1. Mr. Cece bangga sama kamu! 🦍",
    nextHint: "Sekarang lanjut ke A2 — Elementary!",
    gradient: "from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900",
    border: "border-green-400 dark:border-green-600",
    btnClass: "bg-green-500 border-green-800 hover:bg-green-600",
  },
  A2: {
    emoji: "🥇",
    badge: "Master A2",
    title: "A2 Ditaklukkan!",
    subtitle: "Mantap! 160 kata A2 Oxford sudah kamu kuasai. Kamu semakin jago! 💪",
    nextHint: "Saatnya naik ke B1 — Intermediate!",
    gradient: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
    border: "border-blue-400 dark:border-blue-600",
    btnClass: "bg-blue-500 border-blue-800 hover:bg-blue-600",
  },
  B1: {
    emoji: "👑",
    badge: "Master B1",
    title: "Level Menengah Selesai!",
    subtitle: "Luar biasa! 128 kata B1 sudah dikuasai. Kamu hampir setara penutur asli! 🌟",
    nextHint: "Lanjut ke B2 — Upper Intermediate!",
    gradient: "from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900",
    border: "border-purple-400 dark:border-purple-600",
    btnClass: "bg-purple-500 border-purple-800 hover:bg-purple-600",
  },
  B2: {
    emoji: "🏆",
    badge: "Master B2",
    title: "Level Mahir Selesai!",
    subtitle: "Wow! 128 kata B2 sudah di luar kepala. Kemampuan bahasa Inggrismu luar biasa! 🔥",
    nextHint: "Lanjut ke C1 — Advanced!",
    gradient: "from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-900",
    border: "border-pink-400 dark:border-pink-600",
    btnClass: "bg-pink-500 border-pink-800 hover:bg-pink-600",
  },
  C1: {
    emoji: "🐉",
    badge: "Master C1",
    title: "Legendary C1 Advanced!",
    subtitle: "Level dewa! Bahasa Inggrismu sudah setara native speaker akademis. Luar biasa! 🚀",
    nextHint: "Kamu adalah Master C1 sejati! 🥇",
    gradient: "from-fuchsia-50 to-purple-100 dark:from-fuchsia-950 dark:to-purple-900",
    border: "border-fuchsia-400 dark:border-fuchsia-600",
    btnClass: "bg-fuchsia-500 border-fuchsia-800 hover:bg-fuchsia-600",
  },
};

const CONFETTI_COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#FB923C", "#F472B6"];

export default function MilestoneModal({ cefr, onClose }: MilestoneModalProps) {
  if (!cefr) return null;
  const cfg = MILESTONE_CONFIG[cefr];

  return (
    <AnimatePresence>
      {cefr && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
                relative w-full max-w-sm rounded-3xl border-2 border-b-[6px] p-8
                bg-gradient-to-b ${cfg.gradient} ${cfg.border}
                flex flex-col items-center gap-4 text-center shadow-2xl overflow-hidden
              `}
              initial={{ scale: 0.4, y: 80, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* ── Confetti burst ── */}
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 7 + Math.random() * 12,
                    height: 7 + Math.random() * 12,
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                    border: "2px solid rgba(0,0,0,0.1)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.4, 0],
                    opacity: [0, 1, 0],
                    y: [-5, -90 - Math.random() * 70],
                    x: [(Math.random() - 0.5) * 80],
                    rotate: Math.random() * 720,
                  }}
                  transition={{ duration: 1.4, delay: i * 0.04, ease: "easeOut" }}
                />
              ))}

              {/* ── Badge & mascot ── */}
              <motion.div
                className="relative"
                animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="w-24 h-24 relative">
                  <img
                    src="/mascot.png"
                    alt="Mr. Cece"
                    className="w-full h-full object-contain drop-shadow-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl">🦍</span>';
                    }}
                  />
                </div>
                <motion.span
                  className="absolute -bottom-1 -right-2 text-4xl"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.6, stiffness: 300 }}
                >
                  {cfg.emoji}
                </motion.span>
              </motion.div>

              {/* Badge label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="px-4 py-1.5 rounded-full bg-white/70 dark:bg-black/30 border border-white/50 dark:border-white/10 backdrop-blur-sm"
              >
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-gray-300">
                  🏅 Badge Baru: {cfg.badge}
                </span>
              </motion.div>

              {/* Title & body */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{cfg.title}</h2>
                <p className="text-slate-600 dark:text-gray-300 font-medium text-sm leading-relaxed">{cfg.subtitle}</p>
              </motion.div>

              {/* Next hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-4 py-2 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/40 w-full"
              >
                <p className="text-xs font-bold text-slate-500 dark:text-gray-400">{cfg.nextHint}</p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className={`
                  w-full py-4 rounded-2xl font-black text-lg text-white
                  border-2 border-b-[6px] active:border-b-[2px] active:translate-y-[4px]
                  transition-all duration-100 ${cfg.btnClass}
                `}
              >
                Lanjutkan! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
