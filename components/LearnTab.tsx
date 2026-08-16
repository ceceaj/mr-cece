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

export default function LearnTab({
  mistakesCount,
  onStartReview,
  onStartRoleplay
}: {
  mistakesCount: number;
  onStartReview: () => void;
  onStartRoleplay: () => void;
}) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  return (
    <div className="max-w-md mx-auto py-4 px-2">
      <AnimatePresence mode="wait">
        {!selectedLevel ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">Flashcards</h2>
              <p className="text-slate-500 dark:text-gray-400 font-bold mt-1 text-sm">
                Belajar dulu sebelum main!
              </p>
            </div>

            {/* Smart Review Banner */}
            <div className="mb-6">
              <button
                onClick={() => {
                  if (mistakesCount > 0) onStartReview();
                }}
                className={`w-full p-5 rounded-3xl border-2 border-b-[6px] flex items-center justify-between transition-all ${
                  mistakesCount > 0
                    ? "bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600 active:border-b-[2px] active:translate-y-[4px]"
                    : "bg-slate-100 dark:bg-gray-800 border-slate-300 dark:border-gray-700 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-4xl">🧠</span>
                  <div>
                    <h3 className={`font-black text-lg ${mistakesCount > 0 ? "text-purple-800 dark:text-purple-200" : "text-slate-500 dark:text-gray-400"}`}>
                      Smart Review
                    </h3>
                    <p className={`text-xs font-bold ${mistakesCount > 0 ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-gray-500"}`}>
                      {mistakesCount > 0 
                        ? `Ada ${mistakesCount} kata yang perlu diulang!` 
                        : "Belum ada kata yang salah."}
                    </p>
                  </div>
                </div>
                {mistakesCount > 0 && (
                  <span className="bg-purple-500 text-white font-black px-3 py-1.5 rounded-xl text-sm">
                    Mulai
                  </span>
                )}
              </button>
            </div>

            {/* AI Voice Coach Banner */}
            <div className="mb-6">
              <button
                onClick={onStartRoleplay}
                className="w-full p-5 rounded-3xl border-2 border-b-[6px] flex items-center justify-between transition-all bg-gradient-to-r from-blue-500 to-indigo-600 border-indigo-800 text-white active:border-b-[2px] active:translate-y-[4px] shadow-lg shadow-indigo-500/30 overflow-hidden relative"
              >
                <div className="absolute right-[-10px] top-[-10px] text-6xl opacity-20 rotate-12">🤖</div>
                <div className="flex items-center gap-4 text-left relative z-10">
                  <span className="text-4xl drop-shadow-md">🎙️</span>
                  <div>
                    <h3 className="font-black text-lg text-white">AI Voice Roleplay</h3>
                    <p className="text-xs font-bold text-blue-100">Simulasi ngobrol langsung dengan native AI!</p>
                  </div>
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white font-black px-3 py-1.5 rounded-xl text-sm relative z-10">
                  Coba
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {vocabularyData.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setSelectedLevel(level)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-3xl border-2 border-b-[6px] border-blue-500 active:border-b-[2px] active:translate-y-[4px] transition-all flex flex-col items-center text-center hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <span className="text-4xl mb-2">{level.emoji}</span>
                  <span className="font-black text-slate-800 dark:text-white text-sm leading-tight">{level.title}</span>
                  <span className="text-xs font-bold text-slate-400 dark:text-gray-500 mt-1">{level.pairs.length} kata</span>
                </button>
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
            <div className="flex items-center mb-5">
              <button
                onClick={() => setSelectedLevel(null)}
                className="w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 font-black flex items-center justify-center active:border-b-[2px] active:translate-y-[2px]"
              >
                ←
              </button>
              <div className="ml-3">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{selectedLevel.title}</h2>
                <p className="text-xs font-bold text-slate-400 dark:text-gray-500">{selectedLevel.pairs.length} kata • Tap 🔊 untuk dengar</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {selectedLevel.pairs.map((pair, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-slate-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-black text-base text-slate-800 dark:text-white">{pair.en}</span>
                    <span className="font-bold text-slate-500 dark:text-gray-400 text-sm">{pair.id}</span>
                  </div>
                  <button
                    onClick={() => speakWord(pair.en)}
                    className="w-11 h-11 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center text-lg hover:bg-blue-200 dark:hover:bg-blue-800 active:scale-90 transition-all flex-shrink-0"
                    aria-label="Dengar pelafalan"
                  >
                    🔊
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
