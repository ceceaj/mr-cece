"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type UserProfile, getTodayStr } from "@/types";
import { type Level, vocabularyData } from "@/data/vocabulary";
import LearningPath from "./LearningPath";
import LearnTab from "./LearnTab";
import LeaderboardTab from "./LeaderboardTab";
import ProfileTab from "./ProfileTab";

interface DashboardProps {
  profile: UserProfile;
  onSelectLevel: (level: Level) => void;
  onToggleDarkMode: () => void;
  onStartReview: () => void;
  onStartRoleplay: () => void;
  onBuyItem: (itemId: string, cost: number) => void;
}

type Tab = "home" | "learn" | "leaderboard" | "profile";

const TABS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "learn", icon: "📚", label: "Belajar" },
  { id: "leaderboard", icon: "🏆", label: "Rank" },
  { id: "profile", icon: "👤", label: "Profil" },
] as const;

function speakWord(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Pagi", emoji: "🌅", gradient: "from-amber-400 via-orange-400 to-rose-400" };
  if (hour >= 12 && hour < 15) return { text: "Siang", emoji: "☀️", gradient: "from-yellow-400 via-amber-400 to-orange-400" };
  if (hour >= 15 && hour < 18) return { text: "Sore", emoji: "🌇", gradient: "from-orange-500 via-rose-500 to-pink-500" };
  return { text: "Malam", emoji: "🌙", gradient: "from-indigo-600 via-violet-600 to-purple-700" };
}

export default function Dashboard({ profile, onSelectLevel, onToggleDarkMode, onStartReview, onStartRoleplay, onBuyItem }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const wordOfTheDay = useMemo(() => {
    const allPairs = vocabularyData.flatMap(l => l.pairs);
    const today = getTodayStr();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % allPairs.length;
    return allPairs[index];
  }, []);

  const greeting = useMemo(() => getGreeting(), []);

  const totalLevels = vocabularyData.length;
  const completedCount = profile.completedLevels.length;
  const progressPct = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#080B1A] relative pb-24">

      {/* ══════════════════════════ HEADER ══════════════════════════ */}
      <div className="sticky top-0 z-30">
        {/* Glassmorphism header */}
        <div className="glass-light dark:glass border-b border-white/40 dark:border-indigo-500/10 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-xl">🦍</span>
              </div>
              <div>
                <span className="font-black text-lg text-slate-800 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Mr. <span className="gradient-text">Cece</span>
                </span>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-1.5">
              {/* Streak */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30 px-2.5 py-1.5 rounded-xl"
              >
                <span className="text-sm">🔥</span>
                <span className="font-black text-sm text-orange-600 dark:text-orange-400">{profile.streak}</span>
              </motion.div>

              {/* Gems */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-500/30 px-2.5 py-1.5 rounded-xl"
              >
                <span className="text-sm">💎</span>
                <span className="font-black text-sm text-cyan-600 dark:text-cyan-400">{profile.gems || 0}</span>
              </motion.div>

              {/* XP */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-1.5 rounded-xl"
              >
                <span className="text-sm">⭐</span>
                <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">{profile.xp}</span>
              </motion.div>

              {/* Dark mode */}
              <motion.button
                id="toggle-dark-mode"
                onClick={onToggleDarkMode}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600/40 flex items-center justify-center text-base hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors ml-1"
              >
                {profile.darkMode ? "☀️" : "🌙"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════ TAB CONTENT ══════════════════════════ */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-w-md mx-auto px-4 pt-5 pb-8 space-y-5"
            >
              {/* ── Hero Banner ── */}
              <div className={`relative rounded-3xl p-6 bg-gradient-to-br ${greeting.gradient} text-white shadow-xl overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute right-10 top-4 text-5xl opacity-25 rotate-12 select-none">{greeting.emoji}</div>

                <div className="relative z-10">
                  <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">
                    Selamat {greeting.text}
                  </p>
                  <h2 className="text-2xl font-black mb-3" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    {profile.name}! 👋
                  </h2>

                  {/* Overall progress */}
                  <div className="bg-white/15 rounded-2xl px-4 py-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-white/80">Progress Keseluruhan</span>
                      <span className="text-xs font-black text-white">{completedCount}/{totalLevels} level</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full shadow-sm"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Daily Quests ── */}
              {profile.quests && profile.quests.length > 0 && (
                <div className="premium-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                      <span className="text-sm">🎯</span>
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                      Misi Harian
                    </h3>
                    <div className="ml-auto text-xs font-bold text-slate-400">
                      {profile.quests.filter(q => q.completed).length}/{profile.quests.length} selesai
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {profile.quests.map((q, i) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                          q.completed
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20"
                            : "bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          q.completed ? "bg-emerald-100 dark:bg-emerald-800/50" : "bg-slate-100 dark:bg-slate-700/50"
                        }`}>
                          {q.completed ? "✅" : "⏳"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className={`font-bold text-sm truncate ${q.completed ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}>
                              {q.title}
                            </p>
                            <span className={`text-xs font-black ml-2 shrink-0 ${q.completed ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-500 dark:text-indigo-400"}`}>
                              {q.progress}/{q.target}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${q.completed ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-indigo-400 to-violet-500"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                        {q.completed && q.claimed && (
                          <div className="shrink-0 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-600/30">
                            +{q.rewardGems}💎
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Word of the Day ── */}
              {wordOfTheDay && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl shadow-indigo-500/25 overflow-hidden"
                >
                  {/* Decorative */}
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full" />
                  <div className="absolute right-8 bottom-2 w-16 h-16 bg-white/5 rounded-full" />
                  <div className="absolute top-3 right-3 opacity-20 select-none">
                    <span className="text-4xl star-spin inline-block">✨</span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span>💡</span> Word of the Day
                    </p>
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-3xl font-black mb-1 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                          {wordOfTheDay.en}
                        </h3>
                        <p className="text-indigo-200 font-semibold text-sm">{wordOfTheDay.id}</p>
                      </div>
                      <motion.button
                        id="speak-word-of-day"
                        onClick={() => speakWord(wordOfTheDay.en)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-2xl flex items-center justify-center text-xl transition-colors shrink-0"
                      >
                        🔊
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Learning Path ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
                  <h3 className="font-black text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    Jalur Belajar
                  </h3>
                </div>
                <LearningPath
                  completedLevels={profile.completedLevels}
                  stars={profile.stars || {}}
                  onSelectLevel={onSelectLevel}
                />
              </div>
            </motion.div>
          )}

          {/* LEARN TAB */}
          {activeTab === "learn" && (
            <motion.div
              key="tab-learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-w-md mx-auto px-4"
            >
              <LearnTab
                mistakesCount={profile.mistakes?.length || 0}
                onStartReview={onStartReview}
                onStartRoleplay={onStartRoleplay}
              />
            </motion.div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (
            <motion.div
              key="tab-leaderboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-w-md mx-auto px-4"
            >
              <LeaderboardTab profile={profile} />
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-w-md mx-auto px-4"
            >
              <ProfileTab
                profile={profile}
                onToggleDarkMode={onToggleDarkMode}
                onBuyItem={onBuyItem}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══════════════════════════ BOTTOM NAV ══════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-2">
        <div className="max-w-md mx-auto">
          <div className="glass-light dark:glass border border-white/60 dark:border-indigo-500/20 rounded-2xl px-2 py-2 flex justify-around shadow-2xl shadow-black/10 dark:shadow-black/40">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200
                    ${isActive
                      ? "text-white"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    }
                  `}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative text-xl leading-none z-10"
                  >
                    {tab.icon}
                  </motion.span>
                  <span className={`relative text-[10px] font-black uppercase tracking-wider z-10 ${isActive ? "" : "opacity-60"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
