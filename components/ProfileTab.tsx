"use client";

import { motion } from "framer-motion";
import { type UserProfile, BADGES, getDayLabel, getTodayStr } from "@/types";
import { vocabularyData } from "@/data/vocabulary";

interface ProfileTabProps {
  profile: UserProfile;
  onToggleDarkMode: () => void;
  onBuyItem: (itemId: string, cost: number) => void;
}

// ── 7-day XP bar chart ───────────────────────────────────────────────────────
function ActivityChart({ profile }: { profile: UserProfile }) {
  const activity = profile.activity ?? [];
  const today = getTodayStr();

  // Build last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const entry = activity.find((a) => a.date === dateStr);
    return {
      date: dateStr,
      label: getDayLabel(dateStr),
      xp: entry?.xpEarned ?? 0,
      levels: entry?.levelsCompleted ?? 0,
      isToday: dateStr === today,
    };
  });

  const maxXp = Math.max(...days.map((d) => d.xp), 10);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg text-slate-800 dark:text-white">📊 Aktivitas 7 Hari</h3>
        <span className="text-xs font-bold text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          XP
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 h-28">
        {days.map((day) => {
          const barPct = maxXp > 0 ? day.xp / maxXp : 0;
          const hasActivity = day.xp > 0;

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
              {/* XP value */}
              {hasActivity && (
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400">
                  {day.xp}
                </span>
              )}

              {/* Bar */}
              <div className="w-full flex items-end h-20 relative">
                <div className="absolute bottom-0 w-full bg-slate-100 dark:bg-gray-700 rounded-lg overflow-hidden h-20">
                  <motion.div
                    className={`
                      absolute bottom-0 w-full rounded-lg
                      ${day.isToday ? "bg-gradient-to-t from-blue-600 to-blue-400" : hasActivity ? "bg-gradient-to-t from-blue-400/60 to-blue-300/40 dark:from-blue-700 dark:to-blue-600" : "bg-slate-200 dark:bg-gray-600"}
                    `}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(barPct * 100, hasActivity ? 8 : 0)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Day label */}
              <span className={`text-[10px] font-black ${day.isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500"}`}>
                {day.isToday ? "Hari ini" : day.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700 flex justify-between text-center">
        <div>
          <p className="font-black text-base text-slate-800 dark:text-white">
            {days.reduce((sum, d) => sum + d.xp, 0)}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">XP minggu ini</p>
        </div>
        <div>
          <p className="font-black text-base text-slate-800 dark:text-white">
            {days.reduce((sum, d) => sum + d.levels, 0)}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">Level selesai</p>
        </div>
        <div>
          <p className="font-black text-base text-slate-800 dark:text-white">
            {days.filter((d) => d.xp > 0).length}/7
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">Hari aktif</p>
        </div>
      </div>
    </div>
  );
}

// ── Notification reminder button ─────────────────────────────────────────────
function NotificationButton({ profile }: { profile: UserProfile }) {
  const enabled = profile.notificationsEnabled;

  const handleToggle = async () => {
    if (!("Notification" in window)) {
      alert("Browser kamu tidak mendukung notifikasi push.");
      return;
    }

    if (enabled) {
      // Just toggle off in localStorage — can't revoke permission programmatically
      const saved = localStorage.getItem("mrcece_profile");
      if (saved) {
        const p = JSON.parse(saved);
        p.notificationsEnabled = false;
        localStorage.setItem("mrcece_profile", JSON.stringify(p));
        window.location.reload();
      }
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Show a test notification
      new Notification("🦍 Mr. Cece siap menemanimu!", {
        body: "Pengingat harian aktif. Belajar bareng yuk setiap hari!",
        icon: "/mascot.png",
      });

      // Save preference
      const saved = localStorage.getItem("mrcece_profile");
      if (saved) {
        const p = JSON.parse(saved);
        p.notificationsEnabled = true;
        localStorage.setItem("mrcece_profile", JSON.stringify(p));
        window.location.reload();
      }
    } else {
      alert("Izin notifikasi ditolak. Aktifkan di pengaturan browser ya!");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        w-full flex items-center justify-between p-4 rounded-2xl border-2
        transition-all active:scale-[0.98]
        ${enabled
          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
          : "bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600"}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{enabled ? "🔔" : "🔕"}</span>
        <div className="text-left">
          <p className={`font-black text-sm ${enabled ? "text-green-800 dark:text-green-300" : "text-slate-700 dark:text-white"}`}>
            {enabled ? "Pengingat Aktif" : "Aktifkan Pengingat Harian"}
          </p>
          <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500">
            {enabled ? "Mr. Cece akan mengingatkanmu belajar" : "Jangan sampai streak putus!"}
          </p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full border-2 flex items-center px-0.5 transition-colors ${enabled ? "bg-green-500 border-green-700 justify-end" : "bg-slate-200 dark:bg-gray-600 border-slate-300 dark:border-gray-500 justify-start"}`}>
        <div className="w-4 h-4 bg-white rounded-full shadow" />
      </div>
    </button>
  );
}

// ── Main ProfileTab ───────────────────────────────────────────────────────────
export default function ProfileTab({ profile, onToggleDarkMode, onBuyItem }: ProfileTabProps) {
  const handleReset = () => {
    if (confirm("Yakin mau reset semua progress lu? Ini nggak bisa di-undo loh!")) {
      localStorage.removeItem("mrcece_profile");
      window.location.reload();
    }
  };

  const unlockedBadgeIds = new Set(profile.badges);
  const totalWords = profile.completedLevels.reduce((sum, lvl) => {
    const level = vocabularyData.find(l => l.level === lvl);
    return sum + (level?.pairs.length ?? 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-md mx-auto py-6 px-2 flex flex-col gap-5"
    >
      {/* ── Avatar + Name ── */}
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-900/50 rounded-full border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] overflow-hidden mb-3 flex items-center justify-center relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors z-10" />
          <img
            src="/mascot.png"
            alt="Avatar"
            className="w-full h-full object-contain relative z-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = '<span class="text-6xl">🦍</span>';
            }}
          />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{profile.name}</h2>
        <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1 text-xs">
          Pelajar Level {profile.targetCefr}
        </p>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "⭐", value: profile.xp, label: "Total XP", color: "text-blue-600 dark:text-blue-400" },
          { icon: "🔥", value: profile.streak, label: "Hari Streak", color: "text-orange-500" },
          { icon: "📚", value: profile.completedLevels.length, label: "Level Selesai", color: "text-green-500" },
          { icon: "💬", value: totalWords, label: "Kata Dikuasai", color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 flex flex-col items-center text-center shadow-lg shadow-indigo-500/5 hover:scale-[1.02] transition-transform cursor-default">
            <span className="text-2xl mb-1 drop-shadow-sm">{stat.icon}</span>
            <span className={`text-xl font-black ${stat.color} drop-shadow-sm`}>{stat.value}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Activity chart ── */}
      <ActivityChart profile={profile} />

      {/* ── Badges ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5">
        <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          🏅 Badge
          <span className="text-xs font-bold text-slate-400 ml-auto">{unlockedBadgeIds.size}/{BADGES.length}</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const unlocked = unlockedBadgeIds.has(badge.id);
            return (
              <motion.div
                key={badge.id}
                whileHover={unlocked ? { scale: 1.03 } : {}}
                className={`
                  flex items-center gap-3 p-3 rounded-2xl border-2
                  ${unlocked ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50 opacity-45 grayscale"}
                `}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border-2 flex-shrink-0 ${unlocked ? "border-yellow-300 bg-yellow-100 dark:bg-yellow-800/50" : "border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700"}`}>
                  {badge.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-xs ${unlocked ? "text-yellow-800 dark:text-yellow-300" : "text-slate-500 dark:text-gray-400"}`}>{badge.title}</p>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-gray-500 leading-tight mt-0.5">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Shop ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
            🛒 Toko Cece
          </h3>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 text-xs font-black">
            <span>💎</span> {profile.gems || 0}
          </div>
        </div>

        {/* Freeze Streak */}
        <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-slate-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧊</span>
            <div>
              <p className="font-black text-sm text-slate-800 dark:text-white">Freeze Streak</p>
              <p className="text-[10px] font-bold text-slate-500">Lindungi streak dari bolos 1 hari</p>
            </div>
          </div>
          <button 
            onClick={() => onBuyItem("freeze_streak", 50)}
            disabled={(profile.gems || 0) < 50 || (profile.inventory?.includes("freeze_streak"))}
            className="px-4 py-2 bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-gray-600 text-white font-black text-xs rounded-xl border-b-4 border-emerald-700 disabled:border-slate-400 active:translate-y-[2px] active:border-b-2"
          >
            {profile.inventory?.includes("freeze_streak") ? "Terbeli" : "50 💎"}
          </button>
        </div>

        {/* Kacamata Cece */}
        <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-slate-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕶️</span>
            <div>
              <p className="font-black text-sm text-slate-800 dark:text-white">Kacamata Hitam</p>
              <p className="text-[10px] font-bold text-slate-500">Kosmetik untuk Mr. Cece</p>
            </div>
          </div>
          <button 
            onClick={() => onBuyItem("avatar_glasses", 200)}
            disabled={(profile.gems || 0) < 200 || (profile.inventory?.includes("avatar_glasses"))}
            className="px-4 py-2 bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-gray-600 text-white font-black text-xs rounded-xl border-b-4 border-emerald-700 disabled:border-slate-400 active:translate-y-[2px] active:border-b-2"
          >
            {profile.inventory?.includes("avatar_glasses") ? "Dipakai" : "200 💎"}
          </button>
        </div>
      </div>

      {/* ── Settings ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-xl shadow-indigo-500/5 flex flex-col gap-3">
        <h3 className="font-black text-lg text-slate-800 dark:text-white">⚙️ Pengaturan</h3>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-700 border-2 border-slate-200 dark:border-gray-600 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{profile.darkMode ? "🌙" : "☀️"}</span>
            <span className="font-black text-slate-700 dark:text-white text-sm">
              {profile.darkMode ? "Dark Mode Aktif" : "Light Mode Aktif"}
            </span>
          </div>
          <div className={`w-12 h-6 rounded-full border-2 flex items-center px-0.5 transition-colors ${profile.darkMode ? "bg-blue-500 border-blue-700 justify-end" : "bg-slate-200 border-slate-300 justify-start"}`}>
            <div className="w-4 h-4 bg-white rounded-full shadow" />
          </div>
        </button>

        {/* Notification toggle */}
        <NotificationButton profile={profile} />
      </div>

      {/* ── Reset ── */}
      <button
        onClick={handleReset}
        className="w-full py-4 rounded-2xl font-black text-red-500 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 border-b-[6px] active:border-b-[2px] active:translate-y-[4px] transition-all"
      >
        🗑️ Reset Progress
      </button>
    </motion.div>
  );
}
