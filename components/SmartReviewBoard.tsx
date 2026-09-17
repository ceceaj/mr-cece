"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type WordPair, vocabularyData } from "@/data/vocabulary";
import { audioManager } from "@/utils/audio";
import ProgressBar from "./ProgressBar";

interface SmartReviewBoardProps {
  mistakeIds: string[];
  onComplete: (clearedMistakes: string[]) => void;
  onBackToMenu: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SmartReviewBoard({ mistakeIds, onComplete, onBackToMenu }: SmartReviewBoardProps) {
  // Build the review pairs list
  const [pairs] = useState<WordPair[]>(() => {
    const allPairs = vocabularyData.flatMap(l => l.pairs);
    const toReview = allPairs.filter(p => mistakeIds.includes(p.id));
    // Limit to 10 for a single review session
    return shuffle(toReview).slice(0, 10);
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<WordPair[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [showDone, setShowDone] = useState(false);

  const generateOptions = useCallback(() => {
    if (currentIndex >= pairs.length) return;
    const correctPair = pairs[currentIndex];
    
    const allPairs = vocabularyData.flatMap(l => l.pairs);
    const wrongOptions = allPairs.filter(p => p.en !== correctPair.en);
    const shuffledWrong = shuffle(wrongOptions).slice(0, 3);
    
    setOptions(shuffle([correctPair, ...shuffledWrong]));
    setSelectedAnswer(null);
    setIsChecking(false);
  }, [currentIndex, pairs]);

  useEffect(() => {
    generateOptions();
  }, [generateOptions]);

  const handleOptionClick = (option: WordPair) => {
    if (isChecking) return;
    setIsChecking(true);
    setSelectedAnswer(option.id);

    const currentPair = pairs[currentIndex];
    const isCorrect = option.id === currentPair.id;

    if (isCorrect) {
      audioManager.playCorrect();
      setClearedIds(prev => [...prev, currentPair.id]);
    } else {
      audioManager.playWrong();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= pairs.length) {
        if (isCorrect || currentIndex > 0) audioManager.playWin();
        setShowDone(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, isCorrect ? 1000 : 2000);
  };

  if (pairs.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 justify-center items-center p-6 text-center">
        <span className="text-6xl mb-4">🎉</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Tidak ada PR!</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-8 font-medium">Kamu belum punya kata yang perlu direview. Mainkan level untuk belajar kata baru!</p>
        <button
          onClick={onBackToMenu}
          className="bg-blue-500 text-white font-black px-6 py-3 rounded-xl border-b-4 border-blue-700 active:translate-y-[2px] active:border-b-2"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  if (showDone) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 justify-center items-center p-6 text-center">
        <span className="text-6xl mb-4">🧠</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Review Selesai!</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-8 font-medium">Kamu berhasil menguasai {clearedIds.length} kata dari {pairs.length} kata yang di-review.</p>
        <button
          onClick={() => onComplete(clearedIds)}
          className="bg-green-500 text-white font-black px-8 py-4 rounded-xl border-b-4 border-green-700 active:translate-y-[2px] active:border-b-2 text-lg shadow-xl"
        >
          Lanjutkan
        </button>
      </div>
    );
  }

  const currentPair = pairs[currentIndex];
  const progress = pairs.length > 0 ? currentIndex / pairs.length : 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 relative pb-4">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-slate-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBackToMenu}
              className="w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 font-black flex items-center justify-center active:border-b-[2px] active:translate-y-[2px] text-lg"
            >
              ←
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                🧠 Smart Review
              </span>
              <h2 className="font-black text-slate-800 dark:text-gray-200 text-sm tracking-wide">
                Mengingat Kosakata
              </h2>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
          <ProgressBar progress={progress} total={pairs.length} matched={currentIndex} />
        </div>
      </div>

      {/* ── Game Area ── */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center py-6">
        
        {currentPair && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPair.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 text-center"
            >
              <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400">
                {currentPair.en}
              </h2>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="grid grid-cols-2 gap-3 w-full">
          <AnimatePresence mode="popLayout">
            {options.map((opt, i) => {
              const isSelected = selectedAnswer === opt.id;
              const isCorrectAnswer = currentPair?.id === opt.id;
              
              let stateClass = "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-100 hover:border-indigo-400 shadow-sm hover:shadow-indigo-500/20";
              
              if (isChecking) {
                if (isCorrectAnswer) {
                  stateClass = "bg-emerald-500 dark:bg-emerald-600 border-emerald-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02] z-10";
                } else if (isSelected) {
                  stateClass = "bg-red-500 dark:bg-red-600 border-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] z-10";
                } else {
                  stateClass = "opacity-40 grayscale bg-white/50 dark:bg-gray-800/50";
                }
              }

              return (
                <motion.button
                  key={`${currentIndex}-${opt.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isChecking}
                  className={`
                    w-full aspect-[4/3] rounded-2xl border-2 border-b-[6px] 
                    active:border-b-[2px] active:translate-y-[4px] 
                    flex items-center justify-center p-3 transition-all duration-200
                    ${stateClass}
                  `}
                >
                  <span className="font-black text-sm text-center leading-tight">
                    {opt.id}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
