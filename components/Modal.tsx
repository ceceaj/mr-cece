"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  type: "gameover" | "levelcomplete";
  levelTitle?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

const configs = {
  gameover: {
    mascotEmoji: "😔",
    bg: "from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900",
    border: "border-red-300 dark:border-red-700",
    titleColor: "text-red-600 dark:text-red-400",
    title: "Kamu Kehabisan Nyawa! 💔",
    subtitle: "Tenang, jangan menyerah! Mr. Cece percaya kamu bisa!",
    primaryLabel: "Coba Lagi 🔄",
    primaryClass: "bg-blue-500 border-blue-700 text-white hover:bg-blue-600",
    secondaryLabel: "Pilih Level",
  },
  levelcomplete: {
    mascotEmoji: "🎉",
    bg: "from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900",
    border: "border-green-300 dark:border-green-700",
    titleColor: "text-green-600 dark:text-green-400",
    title: "Level Selesai! 🎉",
    subtitle: "Luar biasa! Kamu berhasil mencocokkan semua kata seperti seorang ahli!",
    primaryLabel: "Lanjut →",
    primaryClass: "bg-green-500 border-green-700 text-white hover:bg-green-600",
    secondaryLabel: "Pilih Level",
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
                bg-gradient-to-b ${cfg.bg} ${cfg.border}
                flex flex-col items-center gap-4 text-center shadow-2xl overflow-hidden
              `}
              initial={{ scale: 0.5, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {/* Confetti burst for level complete */}
              {type === "levelcomplete" && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 8 + Math.random() * 12,
                        height: 8 + Math.random() * 12,
                        background: ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#FB923C"][i % 6],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        border: "2px solid rgba(0,0,0,0.15)",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 1, 0],
                        y: [-10, -80 - Math.random() * 60],
                        x: [(Math.random() - 0.5) * 60],
                        rotate: Math.random() * 360,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              {/* Mascot — use gorilla logo */}
              <div className="relative w-32 h-32">
                <img
                  src="/mascot.png"
                  alt="Mr. Cece"
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-7xl">${cfg.mascotEmoji}</span>`;
                  }}
                />
                {/* Emoji reaction badge on top of mascot */}
                <span className="absolute -bottom-1 -right-1 text-3xl">
                  {cfg.mascotEmoji}
                </span>
              </div>

              {levelTitle && (
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full border border-slate-200 dark:border-gray-600">
                  {levelTitle}
                </span>
              )}

              <h2 className={`text-2xl font-black ${cfg.titleColor}`}>{cfg.title}</h2>
              <p className="text-slate-600 dark:text-gray-300 font-medium leading-relaxed text-sm">{cfg.subtitle}</p>

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
                    className="w-full py-3 rounded-2xl font-bold text-sm text-slate-600 dark:text-gray-300
                      border-2 border-b-[4px] border-slate-300 dark:border-gray-600
                      bg-white dark:bg-gray-800
                      active:border-b-[2px] active:translate-y-[2px] transition-all duration-100
                      hover:bg-slate-50 dark:hover:bg-gray-700"
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
