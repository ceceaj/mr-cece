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
  { id: "learn", icon: "📚", label: "Learn" },
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

export default function Dashboard({ profile, onSelectLevel, onToggleDarkMode, onStartReview, onStartRoleplay, onBuyItem }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // Word of the day logic
  const wordOfTheDay = useMemo(() => {
    const allPairs = vocabularyData.flatMap(l => l.pairs);
    const today = getTodayStr();
    // Simple hash function based on date string to always pick the same word today
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % allPairs.length;
    return allPairs[index];
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 relative pb-20">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b-2 border-slate-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦍</span>
            <span className="font-black text-xl text-blue-600 dark:text-blue-400 tracking-tight">Mr. Cece</span>
          </div>
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <div className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-700">
              <span>🔥</span>
              <span>{profile.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
              <span>💎</span>
              <span>{profile.gems || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700 hidden sm:flex">
              <span>⭐</span>
              <span>{profile.xp}</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center text-base active:border-b-[2px] active:translate-y-[2px] transition-all"
            >
              {profile.darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* HOME */}
          {activeTab === "home" && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="max-w-md mx-auto px-4 pt-5 pb-8"
            >
              {/* Hero Banner */}
              <div className="mb-5">
                {(() => {
                  const hour = new Date().getHours();
                  let greeting = "Malam";
                  let bgClass = "from-indigo-900 to-purple-900";
                  let icon = "🌙";
                  if (hour >= 5 && hour < 12) {
                    greeting = "Pagi";
                    bgClass = "from-blue-400 to-cyan-300";
                    icon = "🌅";
                  } else if (hour >= 12 && hour < 15) {
                    greeting = "Siang";
                    bgClass = "from-amber-400 to-orange-400";
                    icon = "☀️";
                  } else if (hour >= 15 && hour < 18) {
                    greeting = "Sore";
                    bgClass = "from-orange-500 to-rose-400";
                    icon = "🌇";
                  }
                  
                  return (
                    <div className={`rounded-3xl p-6 bg-gradient-to-r ${bgClass} text-white shadow-lg relative overflow-hidden`}>
                      <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-30 rotate-12">{icon}</div>
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-1">
                          Selamat {greeting}, {profile.name}! 👋
                        </h2>
                        <p className="font-bold text-sm text-white/90">
                          {profile.completedLevels.length === 0
                            ? "Mulai perjalanan kosakatamu hari ini!"
                            : `${profile.completedLevels.length} level selesai — terus semangat! 💪`}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Daily Quests */}
              {profile.quests && profile.quests.length > 0 && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-slate-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <span>🎯</span> Misi Harian
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {profile.quests.map((q) => (
                      <div key={q.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-xl shrink-0">
                          {q.completed ? "✅" : "⏳"}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-sm text-slate-700 dark:text-gray-200">{q.title}</p>
                            <span className="text-xs font-black text-blue-500">
                              {q.progress} / {q.target}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${q.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                            />
                          </div>
                        </div>
                        {q.completed && q.claimed && (
                          <div className="text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded-lg">
                            +{q.rewardGems}💎
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Word of the Day */}
              {wordOfTheDay && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-5 text-white mb-6 shadow-lg shadow-blue-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl rotate-12">🌟</div>
                  <div className="relative z-10">
                    <p className="text-blue-100 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span>💡</span> Word of the Day
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-3xl font-black mb-1">{wordOfTheDay.en}</h3>
                        <p className="text-blue-100 font-medium">{wordOfTheDay.id}</p>
                      </div>
                      <button
                        onClick={() => speakWord(wordOfTheDay.en)}
                        className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-xl transition-colors active:scale-90"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Path */}
              <LearningPath
                completedLevels={profile.completedLevels}
                stars={profile.stars || {}}
                onSelectLevel={onSelectLevel}
              />
            </motion.div>
          )}

          {activeTab === "learn" && (
            <motion.div key="tab-learn" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="max-w-md mx-auto px-4">
              <LearnTab 
                mistakesCount={profile.mistakes?.length || 0}
                onStartReview={onStartReview}
                onStartRoleplay={onStartRoleplay}
              />
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div key="tab-leaderboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="max-w-md mx-auto px-4">
              <LeaderboardTab profile={profile} />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="tab-profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="max-w-md mx-auto px-4">
              <ProfileTab 
                profile={profile} 
                onToggleDarkMode={onToggleDarkMode} 
                onBuyItem={onBuyItem}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 border-t-2 border-slate-200 dark:border-gray-700 px-2 py-2 flex justify-around">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200
                  ${isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"}
                `}
              >
                <motion.span animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.3 }} className="text-2xl leading-none">
                  {tab.icon}
                </motion.span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? "" : "opacity-60"}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
