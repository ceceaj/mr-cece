"use client";

import { motion, AnimatePresence } from "framer-motion";
import { vocabularyData, type Level } from "@/data/vocabulary";

type NodeStatus = "completed" | "current" | "locked";

interface LearningPathProps {
  completedLevels: number[];
  stars: Record<number, number>;
  onSelectLevel: (level: Level) => void;
}

const UNITS = [
  {
    cefr: "A1" as const,
    label: "Beginner",
    desc: "Kuasai 112 kata dasar Oxford",
    colorClass: "from-green-500 to-emerald-600",
    badgeClass: "bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300 border-green-400 dark:border-green-600",
    ringClass: "ring-green-400",
    nodeActive: "bg-green-500 border-green-700 shadow-green-300/50",
    nodeDone: "bg-green-400 border-green-600",
    emoji: "🌱",
  },
  {
    cefr: "A2" as const,
    label: "Elementary",
    desc: "Tingkatkan dengan 160 kata A2",
    colorClass: "from-blue-500 to-indigo-600",
    badgeClass: "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-400 dark:border-blue-600",
    ringClass: "ring-blue-400",
    nodeActive: "bg-blue-500 border-blue-700 shadow-blue-300/50",
    nodeDone: "bg-blue-400 border-blue-600",
    emoji: "📖",
  },
  {
    cefr: "B1" as const,
    label: "Intermediate",
    desc: "Kuasai 128 kata tingkat menengah",
    colorClass: "from-purple-500 to-violet-600",
    badgeClass: "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-400 dark:border-purple-600",
    ringClass: "ring-purple-400",
    nodeActive: "bg-purple-500 border-purple-700 shadow-purple-300/50",
    nodeDone: "bg-purple-400 border-purple-600",
    emoji: "🚀",
  },
  {
    cefr: "B2" as const,
    label: "Upper Intermediate",
    desc: "Kuasai 128 kata sulit",
    colorClass: "from-pink-500 to-rose-600",
    badgeClass: "bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-300 border-pink-400 dark:border-pink-600",
    ringClass: "ring-pink-400",
    nodeActive: "bg-pink-500 border-pink-700 shadow-pink-300/50",
    nodeDone: "bg-pink-400 border-pink-600",
    emoji: "🏆",
  },
  {
    cefr: "C1" as const,
    label: "Advanced",
    desc: "Kosakata level Dewa!",
    colorClass: "from-fuchsia-600 to-purple-800",
    badgeClass: "bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-400 dark:border-fuchsia-600",
    ringClass: "ring-fuchsia-400",
    nodeActive: "bg-fuchsia-500 border-fuchsia-700 shadow-fuchsia-300/50",
    nodeDone: "bg-fuchsia-400 border-fuchsia-600",
    emoji: "🐉",
  },
  {
    cefr: "TECH" as const,
    label: "Technology",
    desc: "Kosakata IT & Coding",
    colorClass: "from-cyan-500 to-blue-600",
    badgeClass: "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border-cyan-400 dark:border-cyan-600",
    ringClass: "ring-cyan-400",
    nodeActive: "bg-cyan-500 border-cyan-700 shadow-cyan-300/50",
    nodeDone: "bg-cyan-400 border-cyan-600",
    emoji: "💻",
  },
  {
    cefr: "BUSINESS" as const,
    label: "Business",
    desc: "Bisnis & Finansial",
    colorClass: "from-amber-500 to-orange-600",
    badgeClass: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600",
    ringClass: "ring-amber-400",
    nodeActive: "bg-amber-500 border-amber-700 shadow-amber-300/50",
    nodeDone: "bg-amber-400 border-amber-600",
    emoji: "🏢",
  },
  {
    cefr: "TRAVEL" as const,
    label: "Travel",
    desc: "Bandara & Liburan",
    colorClass: "from-sky-400 to-indigo-500",
    badgeClass: "bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border-sky-400 dark:border-sky-600",
    ringClass: "ring-sky-400",
    nodeActive: "bg-sky-500 border-sky-700 shadow-sky-300/50",
    nodeDone: "bg-sky-400 border-sky-600",
    emoji: "✈️",
  },
  {
    cefr: "SLANG" as const,
    label: "Slang & Idiom",
    desc: "Bahasa Gaul Native",
    colorClass: "from-rose-500 to-red-600",
    badgeClass: "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border-rose-400 dark:border-rose-600",
    ringClass: "ring-rose-400",
    nodeActive: "bg-rose-500 border-rose-700 shadow-rose-300/50",
    nodeDone: "bg-rose-400 border-rose-600",
    emoji: "😎",
  },
];

function getNodeStatus(level: Level, completedSet: Set<number>): NodeStatus {
  if (completedSet.has(level.level)) return "completed";
  if (level.level === 1 || completedSet.has(level.level - 1)) return "current";
  return "locked";
}

// ── Single circular node ──────────────────────────────────────────────────────
function LevelNode({
  level,
  status,
  unitConfig,
  stars,
  onClick,
}: {
  level: Level;
  status: NodeStatus;
  unitConfig: (typeof UNITS)[number];
  stars: number;
  onClick: () => void;
}) {
  const isCurrent = status === "current";
  const isDone = status === "completed";
  const isLocked = status === "locked";

  const nodeStyle = isDone
    ? unitConfig.nodeDone
    : isCurrent
    ? unitConfig.nodeActive
    : "bg-slate-200 dark:bg-gray-700 border-slate-400 dark:border-gray-600";

  return (
    <div className="flex flex-col items-center gap-1.5 relative">
      {/* Pulsing outer ring for current node */}
      {isCurrent && (
        <motion.div
          className={`absolute inset-0 rounded-full ring-4 ${unitConfig.ringClass} opacity-60`}
          animate={{ scale: [1, 1.28, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 64, height: 64 }}
        />
      )}

      <motion.button
        onClick={!isLocked ? onClick : undefined}
        whileHover={!isLocked ? { scale: 1.12, y: -3 } : {}}
        whileTap={!isLocked ? { scale: 0.92 } : {}}
        className={`
          relative w-16 h-16 rounded-full
          border-2 border-b-[5px]
          flex items-center justify-center text-2xl
          shadow-lg transition-all duration-150
          ${nodeStyle}
          ${isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
        `}
      >
        <span className="relative z-10 select-none">
          {isDone ? "✅" : isLocked ? "🔒" : level.emoji}
        </span>
      </motion.button>

      {/* Level title label */}
      <span
        className={`
          text-[10px] font-black text-center leading-tight max-w-[80px]
          ${isDone ? "text-green-600 dark:text-green-400" : isCurrent ? "text-blue-600 dark:text-blue-300" : "text-slate-400 dark:text-gray-600"}
        `}
      >
        {level.title.replace(/^(A1|A2|B1|B2|C1|TECH|BUSINESS|TRAVEL|SLANG) — /, "")}
      </span>

      {/* Stars display */}
      {isDone && (
        <div className="flex gap-0.5 mt-0.5">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-xs ${s <= stars ? "opacity-100 drop-shadow-md" : "opacity-20 grayscale"}`}>
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* "MAIN!" bounce label on current node */}
      {isCurrent && (
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest"
        >
          ▶ MAIN!
        </motion.span>
      )}
    </div>
  );
}

// ── Unit header card ──────────────────────────────────────────────────────────
function UnitHeader({
  unit,
  completedCount,
  total,
  locked,
}: {
  unit: (typeof UNITS)[number];
  completedCount: number;
  total: number;
  locked: boolean;
}) {
  const pct = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div
      className={`
        relative rounded-3xl overflow-hidden mb-4
        border-2 border-b-[4px]
        ${locked ? "border-slate-300 dark:border-gray-700 opacity-50" : `border-slate-200 dark:border-gray-700`}
      `}
    >
      {/* Gradient top strip */}
      <div className={`h-2 w-full bg-gradient-to-r ${unit.colorClass} ${locked ? "opacity-40" : ""}`} />

      <div className="bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
              bg-gradient-to-br ${unit.colorClass}
              ${locked ? "grayscale" : "shadow-lg"}
            `}
          >
            {locked ? "🔒" : unit.emoji}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${unit.badgeClass}`}>
                {unit.cefr}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{unit.label}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold">{unit.desc}</p>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-slate-700 dark:text-gray-200">
              {completedCount}/{total}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {!locked && (
          <div className="mt-3 h-2.5 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${unit.colorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        )}

        {locked && (
          <p className="mt-2 text-[11px] font-bold text-slate-400 dark:text-gray-500">
            🔒 Selesaikan semua level {unit.cefr === "A2" ? "A1" : "A2"} untuk membuka ini
          </p>
        )}
      </div>
    </div>
  );
}

// ── Milestone card shown inline in path ───────────────────────────────────────
function InlineMilestoneCard({ unit }: { unit: (typeof UNITS)[number] }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`
        my-4 mx-2 p-4 rounded-3xl border-2 border-b-[4px] text-center
        bg-gradient-to-r ${unit.colorClass} text-white shadow-xl relative overflow-hidden
      `}
    >
      {/* Stars burst decoration */}
      {["⭐", "✨", "🎉"].map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-xl opacity-30"
          style={{ top: `${20 + i * 25}%`, left: i % 2 === 0 ? "5%" : "85%" }}
          animate={{ rotate: [0, 20, -20, 0], y: [0, -5, 0] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {s}
        </motion.span>
      ))}
      <div className="text-3xl mb-1">🏅</div>
      <p className="font-black text-base">Unit {unit.cefr} Selesai!</p>
      <p className="font-bold text-xs opacity-80 mt-0.5">
        Luar biasa! Kamu telah menguasai level {unit.cefr} 🦍
      </p>
    </motion.div>
  );
}

// ── Main LearningPath component ───────────────────────────────────────────────
export default function LearningPath({ completedLevels, stars, onSelectLevel }: LearningPathProps) {
  const completedSet = new Set(completedLevels);

  return (
    <div className="max-w-sm mx-auto pb-8">
      {UNITS.map((unit) => {
        const unitLevels = vocabularyData.filter((l) => l.cefr === unit.cefr);
        const completedInUnit = unitLevels.filter((l) => completedSet.has(l.level)).length;
        const unitComplete = completedInUnit === unitLevels.length && unitLevels.length > 0;

        // Unit is locked if its FIRST level is locked (no previous level done)
        const firstLevel = unitLevels[0];
        const unitLocked =
          firstLevel != null &&
          firstLevel.level > 1 &&
          !completedSet.has(firstLevel.level - 1) &&
          !completedSet.has(firstLevel.level);

        return (
          <div key={unit.cefr}>
            <UnitHeader
              unit={unit}
              completedCount={completedInUnit}
              total={unitLevels.length}
              locked={unitLocked}
            />

            {!unitLocked && (
              <div className="relative pb-2">
                {/* ── Dotted center guide line ── */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
                  style={{
                    width: 2,
                    background:
                      "repeating-linear-gradient(to bottom, #CBD5E1 0px, #CBD5E1 8px, transparent 8px, transparent 18px)",
                  }}
                />

                {/* ── Level nodes in zigzag ── */}
                <div className="flex flex-col gap-7">
                  {unitLevels.map((level, i) => {
                    const status = getNodeStatus(level, completedSet);
                    const isLeft = i % 2 === 0;

                    return (
                      <div
                        key={level.level}
                        className={`relative flex ${isLeft ? "justify-start pl-4" : "justify-end pr-4"}`}
                      >
                        <AnimatePresence>
                          <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.04, type: "spring", stiffness: 220, damping: 20 }}
                          >
                            <LevelNode
                              level={level}
                              status={status}
                              unitConfig={unit}
                              stars={stars[level.level] || 0}
                              onClick={() => onSelectLevel(level)}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Milestone card shown after completing all levels in unit */}
            {unitComplete && <InlineMilestoneCard unit={unit} />}

            {/* Spacer between units */}
            <div className="h-4" />
          </div>
        );
      })}
    </div>
  );
}
