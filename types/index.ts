export interface UserProfile {
  name: string;
  xp: number;
  streak: number;
  completedLevels: number[];
  targetCefr: string;
  darkMode: boolean;
  badges: string[];
  lastPlayDate?: string;        // YYYY-MM-DD
  activity?: DailyActivity[];
  notificationsEnabled?: boolean;
  gems?: number;                // New: In-game currency (1 XP = 1 Gem)
  inventory?: string[];         // New: Purchased items (e.g., "freeze_streak", "avatar_glasses")
  mistakes?: string[];          // Array of word IDs they got wrong
  stars?: Record<number, number>; // levelId -> stars (1-3)
  quests?: DailyQuestState[];   // Active daily quests
}

export interface DailyQuestState {
  id: string;          // e.g. "play_3_levels"
  title: string;
  target: number;      // e.g. 3
  progress: number;
  rewardXP: number;
  rewardGems: number;
  completed: boolean;
  claimed: boolean;
}

export interface LevelCompleteData {
  xpEarned: number;
  perfectRound: boolean;
  comboKing: boolean;
  matchCount?: number;
  mistakesMade?: string[];      // Array of word IDs the user got wrong in this level
  gameMode: GameMode;           // The mode played
}

export type AppView = "onboarding" | "home" | "game" | "review" | "roleplay";

export type GameMode = "normal" | "speed" | "listening" | "typing";

export interface DailyActivity {
  date: string;        // YYYY-MM-DD
  xpEarned: number;
  levelsCompleted: number;
  matchCount: number;
}

export interface BadgeDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export const BADGES: BadgeDefinition[] = [
  { id: "first_step", emoji: "🎯", title: "First Step", description: "Selesaikan level pertamamu!" },
  { id: "a1_master", emoji: "🥈", title: "Master A1", description: "Selesaikan semua 7 level A1!" },
  { id: "a2_master", emoji: "🥇", title: "Master A2", description: "Selesaikan semua 10 level A2!" },
  { id: "b1_master", emoji: "👑", title: "Master B1", description: "Selesaikan semua 8 level B1!" },
  { id: "b2_master", emoji: "🏆", title: "Master B2", description: "Selesaikan semua 8 level B2!" },
  { id: "c1_master", emoji: "🐉", title: "Master C1", description: "Selesaikan semua level C1! Kamu adalah legenda." },
  { id: "perfect", emoji: "💎", title: "Perfect Round", description: "Selesaikan level tanpa kehilangan satu pun hati!" },
  { id: "combo_king", emoji: "⚡", title: "Combo King", description: "Raih combo 5x dalam satu sesi!" },
  { id: "speed_demon", emoji: "🚀", title: "Speed Demon", description: "Selesaikan level dalam mode Speed Run!" },
  { id: "streak_7", emoji: "🔥", title: "Streak 7 Hari", description: "Belajar 7 hari berturut-turut!" },
  { id: "good_listener", emoji: "🎧", title: "Good Listener", description: "Selesaikan mode Listening dengan sempurna!" },
  { id: "typing_master", emoji: "⌨️", title: "Typing Master", description: "Selesaikan mode Typing dengan sempurna!" },
  { id: "shopaholic", emoji: "🛍️", title: "Shopaholic", description: "Beli item pertamamu di toko!" },
];

export const CEFR_RANGES = {
  A1: { min: 1, max: 7 },
  A2: { min: 8, max: 17 },
  B1: { min: 18, max: 25 },
  B2: { min: 26, max: 33 },
  C1: { min: 34, max: 40 },
  TECH: { min: 41, max: 43 },
  BUSINESS: { min: 44, max: 46 },
  TRAVEL: { min: 47, max: 49 },
  SLANG: { min: 50, max: 52 },
};

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getDayLabel(dateStr: string): string {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return days[new Date(dateStr).getDay()];
}
