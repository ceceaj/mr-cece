"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { vocabularyData, type Level } from "@/data/vocabulary";
import {
  type UserProfile,
  type LevelCompleteData,
  type AppView,
  type GameMode,
  type DailyActivity,
  BADGES,
  CEFR_RANGES,
  getTodayStr,
  getYesterdayStr,
} from "@/types";
import GameBoard from "@/components/GameBoard";
import ListeningBoard from "@/components/ListeningBoard";
import TypingBoard from "@/components/TypingBoard";
import SmartReviewBoard from "@/components/SmartReviewBoard";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";
import MilestoneModal, { type CefrLevel } from "@/components/MilestoneModal";
import ModeSelector from "@/components/ModeSelector";
import RoleplayBoard from "@/components/RoleplayBoard";

export default function Home() {
  const [view, setView] = useState<AppView>("home");
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const [cefrMilestone, setCefrMilestone] = useState<CefrLevel | null>(null);
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);
  const pendingLevelRef = useRef<Level | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Guest",
    xp: 0,
    streak: 0,
    completedLevels: [],
    targetCefr: "A1",
    darkMode: false,
    badges: [],
    activity: [],
    notificationsEnabled: false,
    gems: 0,
    inventory: [],
    mistakes: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("mrcece_profile");
    if (savedProfile) {
      const parsed: UserProfile = JSON.parse(savedProfile);

      const today = getTodayStr();
      const yesterday = getYesterdayStr();
      let newStreak = parsed.streak ?? 0;

      if (parsed.lastPlayDate === yesterday) {
        newStreak = parsed.streak;
      } else if (parsed.lastPlayDate && parsed.lastPlayDate !== today) {
        newStreak = 0;
      }

      // Initialize daily quests if a new day
      let quests = parsed.quests || [];
      if (!parsed.lastPlayDate || parsed.lastPlayDate !== today || quests.length === 0) {
        quests = [
          { id: "play_3_levels", title: "Selesaikan 3 Level", target: 3, progress: 0, rewardXP: 100, rewardGems: 10, completed: false, claimed: false },
          { id: "play_typing_1", title: "Main 1 Level Mode Typing", target: 1, progress: 0, rewardXP: 150, rewardGems: 15, completed: false, claimed: false },
          { id: "perfect_1", title: "Raih 1 Perfect Round", target: 1, progress: 0, rewardXP: 50, rewardGems: 5, completed: false, claimed: false },
        ];
      }

      const updatedProfile = { ...parsed, streak: newStreak, quests };
      setProfile(updatedProfile);

      if (parsed.darkMode) {
        document.documentElement.classList.add("dark");
      }

      if (parsed.notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
        const lastNotif = localStorage.getItem("mrcece_last_notif");
        if (lastNotif !== today) {
          setTimeout(() => {
            new Notification("🦍 Waktunya belajar!", {
              body: `Hai ${parsed.name}! Streak kamu: ${newStreak} hari. Jangan putus ya! 🔥`,
              icon: "/mascot.png",
            });
            localStorage.setItem("mrcece_last_notif", today);
          }, 3000);
        }
      }

      setView("home");
    } else {
      setView("onboarding");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mrcece_profile", JSON.stringify(profile));
    }
  }, [profile, isLoaded]);

  const handleToggleDarkMode = useCallback(() => {
    setProfile((prev) => {
      const newDark = !prev.darkMode;
      if (newDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { ...prev, darkMode: newDark };
    });
  }, []);

  const handleOnboardingComplete = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile, gems: 0, inventory: [], mistakes: [] }));
    setView("home");
  };

  const handleLevelSelect = useCallback((level: Level) => {
    pendingLevelRef.current = level;
    setCurrentLevel(level);
    setModeSelectorOpen(true);
  }, []);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setModeSelectorOpen(false);
    setGameMode(mode);
    setView("game");
  }, []);

  const handleModeSelectorClose = useCallback(() => {
    setModeSelectorOpen(false);
    setCurrentLevel(null);
    pendingLevelRef.current = null;
  }, []);

  const handleStartReview = useCallback(() => {
    setView("review");
  }, []);

  const handleStartRoleplay = useCallback(() => {
    setView("roleplay");
  }, []);

  const handleReviewComplete = useCallback((clearedMistakes: string[]) => {
    setProfile(prev => {
      const currentMistakes = prev.mistakes || [];
      const updatedMistakes = currentMistakes.filter(id => !clearedMistakes.includes(id));
      return { ...prev, mistakes: updatedMistakes };
    });
    setView("home");
  }, []);

  const handleBuyItem = useCallback((itemId: string, cost: number) => {
    setProfile(prev => {
      const currentGems = prev.gems || 0;
      if (currentGems < cost) return prev; // Cannot afford

      const currentInv = prev.inventory || [];
      if (currentInv.includes(itemId)) return prev; // Already owns

      const newBadgeSet = new Set(prev.badges);
      if (!newBadgeSet.has("shopaholic")) {
        newBadgeSet.add("shopaholic");
        setNewBadgeIds(curr => [...curr, "shopaholic"]);
      }

      return {
        ...prev,
        gems: currentGems - cost,
        inventory: [...currentInv, itemId],
        badges: Array.from(newBadgeSet)
      };
    });
  }, []);

  const handleLevelComplete = useCallback(
    (data: LevelCompleteData) => {
      if (!currentLevel) return;
      const earned: string[] = [];
      let completedCefr: CefrLevel | null = null;
      const today = getTodayStr();

      setProfile((prev) => {
        const newCompleted = new Set([...prev.completedLevels, currentLevel.level]);
        const newBadgeSet = new Set(prev.badges);

        const awardIfNew = (id: string) => {
          if (!newBadgeSet.has(id)) { newBadgeSet.add(id); earned.push(id); }
        };

        if (newCompleted.size >= 1) awardIfNew("first_step");

        const cefrChecks: Array<{ range: { min: number; max: number }; badgeId: string; cefr: CefrLevel }> = [
          { range: CEFR_RANGES.A1, badgeId: "a1_master", cefr: "A1" },
          { range: CEFR_RANGES.A2, badgeId: "a2_master", cefr: "A2" },
          { range: CEFR_RANGES.B1, badgeId: "b1_master", cefr: "B1" },
          { range: CEFR_RANGES.B2, badgeId: "b2_master", cefr: "B2" },
          { range: CEFR_RANGES.C1, badgeId: "c1_master", cefr: "C1" },
        ];
        for (const { badgeId, cefr } of cefrChecks) {
          const cefrLevels = vocabularyData.filter(l => l.cefr === cefr);
          if (cefrLevels.length > 0) {
            const cefrDone = cefrLevels.filter(l => newCompleted.has(l.level));
            if (cefrDone.length >= cefrLevels.length) {
              awardIfNew(badgeId);
              const wasAlreadyComplete = cefrLevels.every(l => prev.completedLevels.includes(l.level));
              if (!wasAlreadyComplete) completedCefr = cefr;
            }
          }
        }

        if (data.perfectRound) awardIfNew("perfect");
        if (data.comboKing) awardIfNew("combo_king");
        if (data.gameMode === "speed") awardIfNew("speed_demon");
        if (data.gameMode === "listening" && data.perfectRound) awardIfNew("good_listener");
        if (data.gameMode === "typing" && data.perfectRound) awardIfNew("typing_master");

        let newStreak = prev.streak;
        if (prev.lastPlayDate !== today) {
          newStreak = prev.lastPlayDate === getYesterdayStr() ? prev.streak + 1 : 1;
        }
        if (newStreak >= 7) awardIfNew("streak_7");

        const existingActivity: DailyActivity[] = prev.activity ?? [];
        const todayActivity = existingActivity.find(a => a.date === today);
        const newActivity: DailyActivity[] = todayActivity
          ? existingActivity.map(a =>
              a.date === today
                ? { ...a, xpEarned: a.xpEarned + data.xpEarned, levelsCompleted: a.levelsCompleted + 1, matchCount: a.matchCount + (data.matchCount ?? 0) }
                : a
            )
          : [...existingActivity, { date: today, xpEarned: data.xpEarned, levelsCompleted: 1, matchCount: data.matchCount ?? 0 }];

        const trimmedActivity = newActivity
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 30);

        const currentMistakes = new Set(prev.mistakes || []);
        if (data.mistakesMade) {
          data.mistakesMade.forEach(m => currentMistakes.add(m));
        }

        // --- STARS ---
        const starsMap = prev.stars ? { ...prev.stars } : {};
        let earnedStars = 1; // normal
        if (data.gameMode === "speed" || data.gameMode === "listening") earnedStars = 2;
        if (data.gameMode === "typing") earnedStars = 3;

        starsMap[currentLevel.level] = Math.max(starsMap[currentLevel.level] || 0, earnedStars);

        // --- QUESTS ---
        let updatedGems = (prev.gems || 0) + data.xpEarned;
        let updatedXP = prev.xp + data.xpEarned;
        const currentQuests = [...(prev.quests || [])];
        
        // Progress active quests
        for (let i = 0; i < currentQuests.length; i++) {
          const q = currentQuests[i];
          if (q.completed) continue;
          
          if (q.id === "play_3_levels") {
            q.progress += 1;
          } else if (q.id === "play_typing_1" && data.gameMode === "typing") {
            q.progress += 1;
          } else if (q.id === "perfect_1" && data.perfectRound) {
            q.progress += 1;
          }

          if (q.progress >= q.target) {
            q.progress = q.target;
            q.completed = true;
            // Auto claim for simplicity, or we could add a claim button. We'll auto claim.
            q.claimed = true;
            updatedGems += q.rewardGems;
            updatedXP += q.rewardXP;
          }
        }

        return {
          ...prev,
          xp: updatedXP,
          gems: updatedGems,
          streak: newStreak,
          lastPlayDate: today,
          completedLevels: Array.from(newCompleted),
          badges: Array.from(newBadgeSet),
          activity: trimmedActivity,
          mistakes: Array.from(currentMistakes),
          stars: starsMap,
          quests: currentQuests,
        };
      });

      if (earned.length > 0) setNewBadgeIds(earned);

      setView("home");
      setCurrentLevel(null);

      if (completedCefr) {
        setTimeout(() => setCefrMilestone(completedCefr), 600);
      }
    },
    [currentLevel, gameMode]
  );

  const handleBackToMenu = useCallback(() => {
    setView("home");
    setCurrentLevel(null);
  }, []);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white font-sans">

      {currentLevel && (
        <ModeSelector
          levelTitle={currentLevel.title}
          levelEmoji={currentLevel.emoji}
          isOpen={modeSelectorOpen}
          onSelect={handleModeSelect}
          onClose={handleModeSelectorClose}
        />
      )}

      <MilestoneModal
        cefr={cefrMilestone}
        onClose={() => setCefrMilestone(null)}
      />

      <AnimatePresence>
        {newBadgeIds.length > 0 && (
          <motion.div
            key="badge-toast"
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.9 }}
            onAnimationComplete={() => setTimeout(() => setNewBadgeIds([]), 2500)}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"
          >
            {newBadgeIds.map((badgeId, idx) => {
              const badge = BADGES.find((b) => b.id === badgeId);
              if (!badge) return null;
              return (
                <div
                  key={`${badgeId}-${idx}`}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 border-b-[4px] border-yellow-400 rounded-2xl px-4 py-3 shadow-2xl"
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <div>
                    <p className="font-black text-sm text-slate-800 dark:text-white">Badge unlocked!</p>
                    <p className="font-bold text-xs text-yellow-600">{badge.title}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "onboarding" && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="min-h-screen">
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {view === "home" && (
          <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="min-h-screen">
            <Dashboard
              profile={profile}
              onSelectLevel={handleLevelSelect}
              onToggleDarkMode={handleToggleDarkMode}
              onStartReview={handleStartReview}
              onStartRoleplay={handleStartRoleplay}
              onBuyItem={handleBuyItem}
            />
          </motion.div>
        )}

        {view === "game" && currentLevel && (
          <motion.div key={`game-${currentLevel.level}-${gameMode}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="min-h-screen">
            {gameMode === "listening" ? (
              <ListeningBoard
                level={currentLevel}
                onLevelComplete={handleLevelComplete}
                onBackToMenu={handleBackToMenu}
              />
            ) : gameMode === "typing" ? (
              <TypingBoard
                level={currentLevel}
                onLevelComplete={handleLevelComplete}
                onBackToMenu={handleBackToMenu}
              />
            ) : (
              <GameBoard
                level={currentLevel}
                mode={gameMode}
                onLevelComplete={handleLevelComplete}
                onBackToMenu={handleBackToMenu}
              />
            )}
          </motion.div>
        )}

        {view === "review" && (
          <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="min-h-screen">
            <SmartReviewBoard 
              mistakeIds={profile.mistakes || []}
              onComplete={handleReviewComplete}
              onBackToMenu={handleBackToMenu}
            />
          </motion.div>
        )}

        {view === "roleplay" && (
          <motion.div key="roleplay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="min-h-screen">
            <RoleplayBoard 
              onBackToMenu={handleBackToMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
