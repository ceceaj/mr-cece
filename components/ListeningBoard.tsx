"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Level, type WordPair } from "@/data/vocabulary";
import { type LevelCompleteData } from "@/types";
import { audioManager } from "@/utils/audio";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";

interface ListeningBoardProps {
  level: Level;
  onLevelComplete: (data: LevelCompleteData) => void;
  onBackToMenu: () => void;
}

const MAX_HEARTS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speakWord(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  // utterance.lang = "en-US";
  // Just playing English.
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export default function ListeningBoard({ level, onLevelComplete, onBackToMenu }: ListeningBoardProps) {
  const [pairs] = useState<WordPair[]>(() => shuffle([...level.pairs]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  
  const [options, setOptions] = useState<WordPair[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const xpRef = useRef(0);
  const totalMatchesRef = useRef(0);
  const mistakesRef = useRef<Set<string>>(new Set());

  const generateOptions = useCallback(() => {
    if (currentIndex >= pairs.length) return;
    const correctPair = pairs[currentIndex];
    
    // Pick 3 random wrong options
    const wrongOptions = pairs.filter(p => p.en !== correctPair.en);
    const shuffledWrong = shuffle(wrongOptions).slice(0, 3);
    
    setOptions(shuffle([correctPair, ...shuffledWrong]));
    setSelectedAnswer(null);
    setIsChecking(false);
    
    // Auto-play the word
    speakWord(correctPair.en);
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
      setXp(prev => {
        const next = prev + 15;
        xpRef.current = next;
        return next;
      });
      totalMatchesRef.current += 1;
      
      setTimeout(() => {
        if (currentIndex + 1 >= pairs.length) {
          audioManager.playWin();
          setShowLevelComplete(true);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1000);
    } else {
      audioManager.playWrong();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200]);
      mistakesRef.current.add(currentPair.id); // track mistake
      
      setHearts(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setTimeout(() => setShowGameOver(true), 1000);
        } else {
          setTimeout(() => {
            if (currentIndex + 1 >= pairs.length) {
              audioManager.playWin();
              setShowLevelComplete(true);
            } else {
              setCurrentIndex(prev => prev + 1);
            }
          }, 1500);
        }
        return next;
      });
    }
  };

  const currentPair = pairs[currentIndex];
  const progress = pairs.length > 0 ? currentIndex / pairs.length : 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 relative pb-4">
      {/* ── Modals ── */}
      <Modal
        isOpen={showGameOver}
        type="gameover"
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1|B2) — /, "")}`}
        onPrimary={() => window.location.reload()} // Quick restart
        onSecondary={onBackToMenu}
      />
      <Modal
        isOpen={showLevelComplete}
        type="levelcomplete"
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1|B2) — /, "")}`}
        onPrimary={() => {
          setShowLevelComplete(false);
          onLevelComplete({
            xpEarned: xpRef.current,
            perfectRound: hearts === MAX_HEARTS,
            comboKing: false,
            matchCount: totalMatchesRef.current,
            mistakesMade: Array.from(mistakesRef.current),
            gameMode: "listening",
          });
        }}
        onSecondary={onBackToMenu}
      />

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-slate-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={onBackToMenu}
              className="w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 font-black flex items-center justify-center active:border-b-[2px] active:translate-y-[2px] text-lg"
            >
              ←
            </button>

            <div className="flex flex-col items-center">
              <h2 className="font-black text-slate-600 dark:text-gray-300 text-sm tracking-wide">
                {level.title}
              </h2>
              <span className="text-[9px] font-black bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                🎧 Listening
              </span>
            </div>

            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700 text-sm font-black">
              ⭐ {xp} XP
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-lg">
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={i >= hearts ? { scale: [1, 1.3, 0.8, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className={i < hearts ? "opacity-100" : "opacity-20 grayscale"}
                >
                  ❤️
                </motion.span>
              ))}
            </div>
          </div>

          <ProgressBar progress={progress} total={pairs.length} matched={currentIndex} />
        </div>
      </div>

      {/* ── Game Area ── */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center gap-8 py-8">
        
        {/* Play Audio Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => currentPair && speakWord(currentPair.en)}
          className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/40 border-4 border-blue-400 dark:border-blue-600 shadow-xl flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-blue-400/20 group-hover:bg-blue-400/40 transition-colors" />
          <span className="text-6xl relative z-10 group-active:scale-90 transition-transform">🔊</span>
        </motion.button>
        <p className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest -mt-4">
          Ketuk untuk mendengar ulang
        </p>

        {/* Options */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <AnimatePresence mode="popLayout">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isCorrectAnswer = currentPair?.id === opt.id;
              
              let stateClass = "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200";
              
              if (isChecking) {
                if (isCorrectAnswer) {
                  stateClass = "bg-green-100 dark:bg-green-900/60 border-green-500 text-green-800 dark:text-green-200";
                } else if (isSelected) {
                  stateClass = "bg-red-100 dark:bg-red-900/60 border-red-500 text-red-800 dark:text-red-200";
                } else {
                  stateClass = "opacity-50 grayscale";
                }
              }

              return (
                <motion.button
                  key={`${currentIndex}-${opt.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isChecking}
                  className={`w-full p-4 rounded-2xl border-2 border-b-[6px] active:border-b-[2px] active:translate-y-[4px] font-black text-lg transition-all ${stateClass}`}
                >
                  {opt.id}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
