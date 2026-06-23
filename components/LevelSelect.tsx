"use client";

import { motion } from "framer-motion";
import { vocabularyData, type Level } from "@/data/vocabulary";

interface LevelSelectProps {
  onSelect: (level: Level) => void;
  completedLevels: Set<number>;
}

export default function LevelSelect({ onSelect, completedLevels }: LevelSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">🇮🇩</span>
            <span className="text-4xl font-black text-blue-600">×</span>
            <span className="text-4xl">🇬🇧</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800">Mr. Cece</h1>
          <p className="text-slate-500 font-medium mt-1">Choose your level to start!</p>
        </motion.div>

        {/* Level grid */}
        <div className="grid grid-cols-2 gap-3">
          {vocabularyData.map((level, i) => {
            const isCompleted = completedLevels.has(level.level);
            const isLocked = level.level > 1 && !completedLevels.has(level.level - 1) && !isCompleted;

            return (
              <motion.button
                key={level.level}
                onClick={() => !isLocked && onSelect(level)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 16 }}
                whileHover={!isLocked ? { scale: 1.03, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.97 } : {}}
                className={`
                  relative p-4 rounded-2xl border-2 border-b-[5px] text-left
                  transition-all duration-100 font-bold
                  ${isCompleted
                    ? "bg-green-50 border-green-400 text-green-800"
                    : isLocked
                    ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-60"
                    : "bg-white border-black text-slate-800 hover:bg-blue-50 active:border-b-[2px] active:translate-y-[3px]"
                  }
                `}
              >
                {/* Level number */}
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`
                      text-xs font-black px-2 py-0.5 rounded-full border
                      ${isCompleted ? "bg-green-500 text-white border-green-700" : isLocked ? "bg-slate-300 text-slate-500 border-slate-400" : "bg-blue-500 text-white border-blue-700"}
                    `}
                  >
                    Lv.{level.level}
                  </span>
                  <span className="text-2xl">
                    {isLocked ? "🔒" : isCompleted ? "✅" : level.emoji}
                  </span>
                </div>

                <p className="text-sm font-black leading-tight">{level.title}</p>
                <p className={`text-xs mt-1 font-medium ${isLocked ? "text-slate-400" : "text-slate-500"}`}>
                  {level.pairs.length} pairs
                </p>

                {/* Completion stars */}
                {isCompleted && (
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(3)].map((_, s) => (
                      <span key={s} className="text-xs">⭐</span>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-slate-400 mt-6 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Tap an English word to hear it spoken! 🔊
        </motion.p>
      </div>
    </div>
  );
}
