"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Level } from "@/data/vocabulary";
import { type LevelCompleteData, type GameMode } from "@/types";
import { audioManager } from "@/utils/audio";
import WordButton from "./WordButton";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";

interface GameBoardProps {
  level: Level;
  mode: GameMode;
  onLevelComplete: (data: LevelCompleteData) => void;
  onBackToMenu: () => void;
}

type ButtonState = "idle" | "selected" | "correct" | "incorrect";

interface WordItem {
  id: string;
  word: string;
  lang: "en" | "id";
  pairIndex: number;
  state: ButtonState;
}

function speakWord(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

const MAX_HEARTS = 5;
const SLOTS = 4;
const SPEED_SECONDS = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Timer display component ─────────────────────────────────────────────────
function SpeedTimer({ timeLeft }: { timeLeft: number }) {
  const pct = timeLeft / SPEED_SECONDS;
  const urgent = timeLeft <= 10;
  const warning = timeLeft <= 20;

  return (
    <motion.div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-b-[4px] font-black
        ${urgent ? "bg-red-50 dark:bg-red-900/40 border-red-400 text-red-600 dark:text-red-400"
          : warning ? "bg-orange-50 dark:bg-orange-900/40 border-orange-400 text-orange-600 dark:text-orange-400"
          : "bg-green-50 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-400"}
      `}
      animate={urgent ? { scale: [1, 1.06, 1] } : {}}
      transition={urgent ? { duration: 0.5, repeat: Infinity } : {}}
    >
      <span className="text-base">⏱️</span>
      <span className="text-base tabular-nums w-7 text-center">{timeLeft}</span>
      {/* mini bar */}
      <div className="w-14 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${urgent ? "bg-red-500" : warning ? "bg-orange-400" : "bg-green-500"}`}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export default function GameBoard({ level, mode, onLevelComplete, onBackToMenu }: GameBoardProps) {
  const [enSlots, setEnSlots] = useState<(WordItem | null)[]>(Array(SLOTS).fill(null));
  const [idSlots, setIdSlots] = useState<(WordItem | null)[]>(Array(SLOTS).fill(null));
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // UI state
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [matchedCount, setMatchedCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [reachedCombo5, setReachedCombo5] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // Speed run timer
  const [timeLeft, setTimeLeft] = useState<number>(mode === "speed" ? SPEED_SECONDS : 0);
  const timerRunningRef = useRef(false);

  // Refs for synchronous access inside callbacks
  const poolIndexRef = useRef(0);
  const matchedRef = useRef(0);
  const heartsRef = useRef(MAX_HEARTS);
  const comboRef = useRef(0);
  const xpRef = useRef(0);
  const checkingRef = useRef(false);
  const reachedCombo5Ref = useRef(false);
  const totalMatchesRef = useRef(0);
  const mistakesRef = useRef<Set<string>>(new Set());

  const getNextPair = useCallback(() => {
    if (poolIndexRef.current >= level.pairs.length) return null;
    const idx = poolIndexRef.current;
    const pair = level.pairs[idx];
    poolIndexRef.current = idx + 1;
    return {
      en: { id: `en-${idx}`, word: pair.en, lang: "en" as const, pairIndex: idx, state: "idle" as const },
      id: { id: `id-${idx}`, word: pair.id, lang: "id" as const, pairIndex: idx, state: "idle" as const },
    };
  }, [level.pairs]);

  const addXp = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      xpRef.current = next;
      return next;
    });
  }, []);

  const initBoard = useCallback(() => {
    const pairs = level.pairs;
    const initialCount = Math.min(SLOTS, pairs.length);

    poolIndexRef.current = initialCount;
    matchedRef.current = 0;
    heartsRef.current = MAX_HEARTS;
    comboRef.current = 0;
    xpRef.current = 0;
    checkingRef.current = false;
    reachedCombo5Ref.current = false;
    totalMatchesRef.current = 0;
    timerRunningRef.current = false;
    mistakesRef.current.clear();

    const initialEn: (WordItem | null)[] = [];
    const initialId: (WordItem | null)[] = [];
    for (let i = 0; i < initialCount; i++) {
      initialEn.push({ id: `en-${i}`, word: pairs[i].en, lang: "en", pairIndex: i, state: "idle" });
      initialId.push({ id: `id-${i}`, word: pairs[i].id, lang: "id", pairIndex: i, state: "idle" });
    }
    while (initialEn.length < SLOTS) initialEn.push(null);
    while (initialId.length < SLOTS) initialId.push(null);

    setEnSlots(initialEn);
    setIdSlots(shuffle(initialId));
    setSelectedEn(null);
    setSelectedId(null);
    setHearts(MAX_HEARTS);
    setMatchedCount(0);
    setCombo(0);
    setXp(0);
    setReachedCombo5(false);
    setShowGameOver(false);
    setShowLevelComplete(false);
    setTimeLeft(mode === "speed" ? SPEED_SECONDS : 0);
  }, [level, mode]);

  useEffect(() => { initBoard(); }, [initBoard]);

  // ── Speed run countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "speed") return;
    if (showGameOver || showLevelComplete) return;
    if (timeLeft <= 0) {
      // Time's up!
      if (!showGameOver && !showLevelComplete) {
        setTimeout(() => setShowGameOver(true), 200);
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [mode, timeLeft, showGameOver, showLevelComplete]);

  // ── Word click handler ───────────────────────────────────────────────────
  const handleWordClick = useCallback(
    (item: WordItem, slotType: "en" | "id") => {
      if (checkingRef.current) return;
      if (item.state !== "idle" && item.state !== "selected") return;

      if (slotType === "en") {
        speakWord(item.word);
        if (selectedEn === item.id) {
          setSelectedEn(null);
          setEnSlots((prev) => prev.map((s) => (s?.id === item.id ? { ...s, state: "idle" } : s)));
        } else {
          if (selectedEn) setEnSlots((prev) => prev.map((s) => (s?.id === selectedEn ? { ...s, state: "idle" } : s)));
          setSelectedEn(item.id);
          setEnSlots((prev) => prev.map((s) => (s?.id === item.id ? { ...s, state: "selected" } : s)));
        }
      } else {
        if (selectedId === item.id) {
          setSelectedId(null);
          setIdSlots((prev) => prev.map((s) => (s?.id === item.id ? { ...s, state: "idle" } : s)));
        } else {
          if (selectedId) setIdSlots((prev) => prev.map((s) => (s?.id === selectedId ? { ...s, state: "idle" } : s)));
          setSelectedId(item.id);
          setIdSlots((prev) => prev.map((s) => (s?.id === item.id ? { ...s, state: "selected" } : s)));
        }
      }
    },
    [selectedEn, selectedId]
  );

  // ── Match check ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedEn || !selectedId || checkingRef.current) return;
    checkingRef.current = true;

    const enItem = enSlots.find((s) => s?.id === selectedEn);
    const idItem = idSlots.find((s) => s?.id === selectedId);
    if (!enItem || !idItem) { checkingRef.current = false; return; }

    const isMatch = enItem.pairIndex === idItem.pairIndex;

    if (isMatch) {
      audioManager.playCorrect();
      setEnSlots((prev) => prev.map((s) => (s?.id === selectedEn ? { ...s, state: "correct" } : s)));
      setIdSlots((prev) => prev.map((s) => (s?.id === selectedId ? { ...s, state: "correct" } : s)));

      const newCombo = comboRef.current + 1;
      comboRef.current = newCombo;
      if (newCombo >= 5 && !reachedCombo5Ref.current) {
        reachedCombo5Ref.current = true;
        setReachedCombo5(true);
      }
      setCombo(newCombo);
      totalMatchesRef.current += 1;

      const multiplier = newCombo >= 5 ? 2 : newCombo >= 3 ? 1.5 : 1;
      addXp(10 * multiplier);

      const capturedEnId = selectedEn;
      const capturedIdId = selectedId;

      setTimeout(() => {
        const nextPair = getNextPair();
        setEnSlots((prev) => {
          const next = [...prev];
          const idx = next.findIndex((s) => s?.id === capturedEnId);
          if (idx !== -1) next[idx] = nextPair ? nextPair.en : null;
          return next;
        });
        setIdSlots((prev) => {
          const next = [...prev];
          const idx = next.findIndex((s) => s?.id === capturedIdId);
          if (idx !== -1) next[idx] = nextPair ? nextPair.id : null;
          return next;
        });

        setSelectedEn(null);
        setSelectedId(null);
        checkingRef.current = false;

        const newMatched = matchedRef.current + 1;
        matchedRef.current = newMatched;
        setMatchedCount(newMatched);

        if (newMatched >= level.pairs.length) {
          audioManager.playWin();
          addXp(mode === "speed" ? 100 : 50); // extra bonus for speed mode
          setTimeout(() => setShowLevelComplete(true), 500);
        }
      }, 700);

    } else {
      audioManager.playWrong();
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200]);
      mistakesRef.current.add(level.pairs[enItem.pairIndex].id); // store ID (Indonesian word) to track mistake

      setEnSlots((prev) => prev.map((s) => (s?.id === selectedEn ? { ...s, state: "incorrect" } : s)));
      setIdSlots((prev) => prev.map((s) => (s?.id === selectedId ? { ...s, state: "incorrect" } : s)));
      comboRef.current = 0;
      setCombo(0);

      const capturedEnId = selectedEn;
      const capturedIdId = selectedId;

      setTimeout(() => {
        setEnSlots((prev) => prev.map((s) => (s?.id === capturedEnId ? { ...s, state: "idle" } : s)));
        setIdSlots((prev) => prev.map((s) => (s?.id === capturedIdId ? { ...s, state: "idle" } : s)));
        setSelectedEn(null);
        setSelectedId(null);

        const newHearts = Math.max(0, heartsRef.current - 1);
        heartsRef.current = newHearts;
        setHearts(newHearts);
        if (newHearts <= 0) setTimeout(() => setShowGameOver(true), 400);

        checkingRef.current = false;
      }, 700);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEn, selectedId]);

  const progress = level.pairs.length > 0 ? matchedCount / level.pairs.length : 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 relative pb-4">
      {/* ── Modals ── */}
      <Modal
        isOpen={showGameOver}
        type="gameover"
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1) — /, "")}`}
        onPrimary={initBoard}
        onSecondary={onBackToMenu}
      />
      <Modal
        isOpen={showLevelComplete}
        type="levelcomplete"
        levelTitle={`${level.cefr} — ${level.title.replace(/^(A1|A2|B1) — /, "")}`}
        onPrimary={() => {
          setShowLevelComplete(false);
          onLevelComplete({
            xpEarned: xpRef.current,
            perfectRound: heartsRef.current === MAX_HEARTS,
            comboKing: reachedCombo5Ref.current,
            matchCount: totalMatchesRef.current,
            mistakesMade: Array.from(mistakesRef.current),
            gameMode: mode,
          });
        }}
        onSecondary={onBackToMenu}
      />

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-slate-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            {/* Back button */}
            <button
              onClick={onBackToMenu}
              className="w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 font-black flex items-center justify-center active:border-b-[2px] active:translate-y-[2px] text-lg"
            >
              ←
            </button>

            {/* Level title + mode badge */}
            <div className="flex flex-col items-center">
              <h2 className="font-black text-slate-600 dark:text-gray-300 text-sm tracking-wide">
                {level.title}
              </h2>
              {mode === "speed" && (
                <span className="text-[9px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                  ⚡ Speed Run
                </span>
              )}
            </div>

            {/* XP or Timer */}
            {mode === "speed" ? (
              <SpeedTimer timeLeft={timeLeft} />
            ) : (
              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700 text-sm font-black">
                ⭐ {Math.round(xp)} XP
              </div>
            )}
          </div>

          {/* Hearts + Combo */}
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
            <AnimatePresence>
              {combo >= 3 && (
                <motion.div
                  key={`combo-${combo}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-orange-500 font-black text-sm relative"
                >
                  🔥 Combo ×{combo}
                  {/* Particle burst */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full"
                      initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
                      animate={{ 
                        x: `calc(-50% + ${Math.cos(i * (Math.PI / 3)) * 30}px)`,
                        y: `calc(-50% + ${Math.sin(i * (Math.PI / 3)) * 30}px)`,
                        scale: 0, 
                        opacity: 0 
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress */}
          <ProgressBar progress={progress} total={level.pairs.length} matched={matchedCount} />
        </div>
      </div>

      {/* ── Game Grid ── */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 flex flex-col justify-center gap-0">
        <div className="grid grid-cols-2 gap-4 mb-2 px-1">
          <span className="text-center text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">🇬🇧 English</span>
          <span className="text-center text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">🇮🇩 Indonesia</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* English column */}
          <div className="flex flex-col gap-3">
            {enSlots.map((item, i) => (
              <div key={`en-slot-${i}`} className="h-16">
                <AnimatePresence mode="popLayout">
                  {item ? (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.6, opacity: 0, x: -30 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.6, opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="h-full"
                    >
                      <WordButton word={item.word} lang={item.lang} state={item.state} disabled={item.state === "correct"} onClick={() => handleWordClick(item, "en")} />
                    </motion.div>
                  ) : (
                    <div className="h-full w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-gray-600 opacity-30" />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Indonesian column */}
          <div className="flex flex-col gap-3">
            {idSlots.map((item, i) => (
              <div key={`id-slot-${i}`} className="h-16">
                <AnimatePresence mode="popLayout">
                  {item ? (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.6, opacity: 0, x: 30 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.6, opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="h-full"
                    >
                      <WordButton word={item.word} lang={item.lang} state={item.state} disabled={item.state === "correct"} onClick={() => handleWordClick(item, "id")} />
                    </motion.div>
                  ) : (
                    <div className="h-full w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-gray-600 opacity-30" />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
