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

export default function ModeSelector({ levelTitle, levelEmoji, isOpen, onSelect, onClose }: ModeSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl px-6 pt-4 pb-10 shadow-2xl">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

              {/* Level info */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{levelEmoji}</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Level Dipilih</p>
                  <h3 className="font-black text-lg text-slate-800 dark:text-white leading-tight">{levelTitle}</h3>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-500 dark:text-gray-400 mb-4">Pilih mode bermain:</p>

              <div className="flex flex-col gap-3">
                {/* Normal Mode */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect("normal")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-b-[6px] border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-left active:border-b-[2px] active:translate-y-[4px] transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/60 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center text-3xl flex-shrink-0">
                    📚
                  </div>
                  <div>
                    <p className="font-black text-base text-blue-800 dark:text-blue-200">Mode Normal</p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">Santai tanpa tekanan waktu. Cocok untuk belajar serius.</p>
                  </div>
                </motion.button>

                {/* Speed Run Mode */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect("speed")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-b-[6px] border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-left active:border-b-[2px] active:translate-y-[4px] transition-all relative overflow-hidden"
                >
                  {/* Animated shimmer for speed mode */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/30 dark:via-orange-400/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/60 border-2 border-orange-300 dark:border-orange-700 flex items-center justify-center text-3xl flex-shrink-0 relative z-10">
                    ⚡
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-base text-orange-800 dark:text-orange-200">Speed Run</p>
                      <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">60 detik</span>
                    </div>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">Cocokkan semua kata sebelum waktu habis! Bonus badge 🚀</p>
                  </div>
                </motion.button>

                {/* Listening Mode */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect("listening")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-b-[6px] border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-left active:border-b-[2px] active:translate-y-[4px] transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/60 border-2 border-purple-300 dark:border-purple-700 flex items-center justify-center text-3xl flex-shrink-0">
                    🎧
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-base text-purple-800 dark:text-purple-200">Listening</p>
                    </div>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5">Dengarkan kata dan pilih artinya.</p>
                  </div>
                </motion.button>

                {/* Typing Mode */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect("typing")}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-b-[6px] border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 text-left active:border-b-[2px] active:translate-y-[4px] transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/60 border-2 border-rose-300 dark:border-rose-700 flex items-center justify-center text-3xl flex-shrink-0">
                    ⌨️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-base text-rose-800 dark:text-rose-200">Typing (Hardcore)</p>
                      <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Baru!</span>
                    </div>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">Ketik terjemahannya tanpa pilihan ganda!</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
