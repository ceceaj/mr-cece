"use client";

import { motion } from "framer-motion";
import { type UserProfile } from "@/types";

interface LeaderboardTabProps {
  profile: UserProfile;
}

const dummyPlayers = [
  { name: "Budi Setiawan", xp: 1200, avatar: "👨", country: "🇮🇩" },
  { name: "Siti Aminah", xp: 950, avatar: "👩", country: "🇮🇩" },
  { name: "Joko Anwar", xp: 820, avatar: "🧔", country: "🇮🇩" },
  { name: "Rina Nose", xp: 600, avatar: "👱‍♀️", country: "🇮🇩" },
  { name: "Andi Wijaya", xp: 450, avatar: "👦", country: "🇮🇩" },
  { name: "Dewi Lestari", xp: 300, avatar: "👧", country: "🇮🇩" },
  { name: "Rizky Pratama", xp: 180, avatar: "👨‍🎓", country: "🇮🇩" },
];

export default function LeaderboardTab({ profile }: LeaderboardTabProps) {
  const allPlayers = [
    ...dummyPlayers.map((p) => ({ ...p, isUser: false })),
    { name: profile.name, xp: profile.xp, avatar: "🦍", country: "🇮🇩", isUser: true },
  ].sort((a, b) => b.xp - a.xp);

  const userRank = allPlayers.findIndex((p) => p.isUser) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-md mx-auto py-4 px-2"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">Global Rank</h2>
        <p className="text-slate-500 dark:text-gray-400 font-bold mt-1 text-sm">Kumpulkan XP untuk naik peringkat!</p>
      </div>

      {/* User rank highlight */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="font-black text-2xl text-blue-600 dark:text-blue-400">#{userRank}</span>
        <span className="text-3xl">🦍</span>
        <div className="flex-1">
          <p className="font-black text-slate-800 dark:text-white">{profile.name} <span className="text-blue-500">(You)</span></p>
          <p className="text-xs font-bold text-slate-400 dark:text-gray-500">{profile.xp} XP saat ini</p>
        </div>
        <div className="text-right">
          <p className="font-black text-blue-600 dark:text-blue-400 text-lg">{profile.xp}</p>
          <p className="text-[10px] font-bold text-slate-400">XP</p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="flex flex-col gap-3">
        {allPlayers.map((player, index) => {
          let medal = `${index + 1}`;
          if (index === 0) medal = "🥇";
          else if (index === 1) medal = "🥈";
          else if (index === 2) medal = "🥉";

          return (
            <motion.div
              key={`${player.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center p-4 rounded-2xl border-2
                ${player.isUser
                  ? "bg-blue-100 dark:bg-blue-900/40 border-blue-500 dark:border-blue-600 border-b-[4px]"
                  : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700"}
              `}
            >
              <div className="w-10 h-10 flex items-center justify-center font-black text-xl">
                {medal}
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl mx-3 border-2 border-slate-300 dark:border-gray-600 flex-shrink-0">
                {player.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-black text-base truncate ${player.isUser ? "text-blue-800 dark:text-blue-300" : "text-slate-700 dark:text-gray-200"}`}>
                  {player.name}
                </h3>
              </div>
              <div className="text-right ml-2">
                <span className="font-black text-blue-600 dark:text-blue-400">{player.xp}</span>
                <span className="text-[10px] font-bold text-slate-400 block">XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
