"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Level, type WordPair } from "@/data/vocabulary";
import { type LevelCompleteData } from "@/types";
import { audioManager } from "@/utils/audio";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";

interface TypingBoardProps {
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

export default function TypingBoard({ level, onLevelComplete, onBackToMenu }: TypingBoardProps) {
  const [pairs] = useState<WordPair[]>(() => shuffle([...level.pairs]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  
  const [inputValue, setInputValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const xpRef = useRef(0);
  const mistakesRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isChecking && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChecking, currentIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || !inputValue.trim()) return;
    
    setIsChecking(true);
    const currentPair = pairs[currentIndex];
    
    // Check spelling (case insensitive, trimmed)
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedAnswer = currentPair.en.trim().toLowerCase();
    
    const correct = normalizedInput === normalizedAnswer;
    setIsCorrect(correct);

    if (correct) {
      audioManager.playCorrect();
      setXp(prev => {
        const next = prev + 20; // Typing mode gives more XP
        xpRef.current = next;
        return next;
      });
      
      setTimeout(() => {
        if (currentIndex + 1 >= pairs.length) {
          audioManager.playWin();
          setShowLevelComplete(true);
        } else {
          setCurrentIndex(prev => prev + 1);
          setInputValue("");
          setIsChecking(false);
          setIsCorrect(null);
        }
      }, 1000);
    } else {
      audioManager.playWrong();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200]);
      mistakesRef.current.add(currentPair.id);
      
      setHearts(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setTimeout(() => setShowGameOver(true), 2000); // Give time to read correct answer
        } else {
          setTimeout(() => {
            if (currentIndex + 1 >= pairs.length) {
              audioManager.playWin();
              setShowLevelComplete(true);
            } else {
              setCurrentIndex(prev => prev + 1);
              setInputValue("");
              setIsChecking(false);
              setIsCorrect(null);
            }
          }, 2000);
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
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1|B2|C1) — /, "")}`}
        onPrimary={() => window.location.reload()} 
        onSecondary={onBackToMenu}
      />
      <Modal
        isOpen={showLevelComplete}
        type="levelcomplete"
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1|B2|C1) — /, "")}`}
        onPrimary={() => {
          setShowLevelComplete(false);
          onLevelComplete({
            xpEarned: xpRef.current,
            perfectRound: hearts === MAX_HEARTS,
            comboKing: false,
            matchCount: pairs.length,
            mistakesMade: Array.from(mistakesRef.current),
            gameMode: "typing",
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
              <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                ⌨️ Typing
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
      <div className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col items-center justify-center py-8">
        
        {currentPair && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPair.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10 text-center"
            >
              <p className="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2">Terjemahkan ke Bahasa Inggris</p>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white leading-tight">
                "{currentPair.id}"
              </h2>
            </motion.div>
          </AnimatePresence>
        )}

        <form onSubmit={handleSubmit} className="w-full relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isChecking}
            placeholder="Ketik di sini..."
            className="w-full bg-white dark:bg-gray-800 border-2 border-b-[6px] border-slate-300 dark:border-gray-600 rounded-2xl px-6 py-5 text-xl font-bold text-slate-800 dark:text-white outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-gray-500 text-center"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          
          <AnimatePresence>
            {isChecking && isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute left-0 right-0 top-full mt-4 p-4 rounded-2xl border-2 border-b-[4px] text-center
                  ${isCorrect ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/40 dark:text-green-200' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`}
              >
                {isCorrect ? (
                  <p className="font-black text-lg flex items-center justify-center gap-2"><span>✅</span> Benar!</p>
                ) : (
                  <div>
                    <p className="font-black text-lg flex items-center justify-center gap-2 mb-1"><span>❌</span> Salah!</p>
                    <p className="text-sm font-bold opacity-80">Jawaban yang benar: <span className="font-black">{currentPair?.en}</span></p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>
    </div>
  );
}
