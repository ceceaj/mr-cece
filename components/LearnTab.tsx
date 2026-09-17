"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vocabularyData, type Level } from "@/data/vocabulary";

function speakWord(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const FEATURE_CARDS = [
  {
    id: "review",
    icon: "🧠",
    title: "Smart Review",
    desc: "Sistem spaced repetition — ulang kata yang sering salah",
    gradient: "from-violet-500 to-purple-600",
    glowColor: "shadow-violet-500/25",
    badge: null,
  },
  {
    id: "roleplay",
    icon: "🎙️",
    title: "AI Voice Roleplay",
    desc: "Simulasi ngobrol langsung dengan AI berbasis Gemini",
    gradient: "from-indigo-500 to-blue-600",
    glowColor: "shadow-indigo-500/25",
    badge: "AI",
  },
];

export default function LearnTab({
  mistakesCount,
  onStartReview,
  onStartRoleplay,
}: {
  mistakesCount: number;
  onStartReview: () => void;
  onStartRoleplay: () => void;
}) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  return (
    <div className="max-w-md mx-auto py-5 px-2">
      <AnimatePresence mode="wait">
        {!selectedLevel ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                Pusat Belajar 📚
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-1">
                Pelajari kata-kata sebelum main game!
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {/* Smart Review */}
              <motion.button
                id="start-smart-review"
                onClick={() => { if (mistakesCount > 0) onStartReview(); }}
                whileHover={mistakesCount > 0 ? { scale: 1.02, y: -2 } : {}}
                whileTap={mistakesCount > 0 ? { scale: 0.98 } : {}}
                className={`relative w-full p-5 rounded-3xl text-left overflow-hidden transition-all shadow-lg ${
                  mistakesCount > 0
                    ? "shadow-violet-500/20 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-700 ${mistakesCount > 0 ? "" : "grayscale"}`} />
                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg shrink-0">
                    🧠
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                        Smart Review
                      </h3>
                      {mistakesCount > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {mistakesCount} kata
                        </span>
                      )}
                    </div>
                    <p className="text-violet-100 text-xs font-semibold">
                      {mistakesCount > 0
                        ? `Ada ${mistakesCount} kata yang perlu diulang!`
                        : "Belum ada kata yang perlu diulang"}
                    </p>
                  </div>
                  {mistakesCount > 0 && (
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black shrink-0">
                      →
                    </div>
                  )}
                </div>
              </motion.button>

              {/* AI Roleplay */}
              <motion.button
                id="start-ai-roleplay"
                onClick={onStartRoleplay}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full p-5 rounded-3xl text-left overflow-hidden shadow-lg shadow-indigo-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600" />
                <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute right-8 bottom-2 w-16 h-16 bg-white/10 rounded-full" />
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg shrink-0">
                    🎙️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-lg text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                        AI Voice Roleplay
                      </h3>
                      <span className="bg-cyan-400/30 border border-cyan-300/50 text-cyan-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        AI
                      </span>
                    </div>
                    <p className="text-blue-100 text-xs font-semibold">
                      Simulasi percakapan nyata dengan AI berbasis Gemini
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black shrink-0">
                    →
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Flashcard list */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
              <h3 className="font-black text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                Flashcards per Level
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {vocabularyData.map((level, i) => (
                <motion.button
                  key={level.level}
                  id={`flashcard-level-${level.level}`}
                  onClick={() => setSelectedLevel(level)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="premium-card p-4 flex flex-col items-center text-center"
                >
                  <span className="text-3xl mb-2">{level.emoji}</span>
                  <span className="font-black text-slate-800 dark:text-white text-xs leading-tight">
                    {level.title.replace(/^(A1|A2|B1|B2|C1|TECH|BUSINESS|TRAVEL|SLANG) — /, "")}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-400 mt-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                    {level.pairs.length} kata
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Back + title */}
            <div className="flex items-center mb-5 gap-3">
              <motion.button
                id="back-from-flashcards"
                onClick={() => setSelectedLevel(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl premium-card flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-lg"
              >
                ←
              </motion.button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedLevel.emoji}</span>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    {selectedLevel.title}
                  </h2>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  {selectedLevel.pairs.length} kata · Tap 🔊 untuk mendengar
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {selectedLevel.pairs.map((pair, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.025 }}
                  className="premium-card p-4 flex justify-between items-center"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-base text-slate-800 dark:text-white">{pair.en}</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">{pair.id}</span>
                  </div>
                  <motion.button
                    id={`speak-${pair.en}`}
                    onClick={() => speakWord(pair.en)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-600/30 text-indigo-500 dark:text-indigo-400 rounded-xl flex items-center justify-center text-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shrink-0"
                    aria-label={`Dengar pelafalan ${pair.en}`}
                  >
                    🔊
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
