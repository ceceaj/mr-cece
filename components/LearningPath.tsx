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
    desc: "Kuasai kata-kata dasar Oxford",
    gradient: "from-emerald-400 to-teal-500",
    gradientDark: "from-emerald-500 to-teal-600",
    glowColor: "shadow-emerald-500/30",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-300 dark:border-emerald-600/50",
    nodeActive: "from-emerald-400 to-teal-500",
    nodeGlow: "shadow-emerald-500/50",
    ringColor: "#10B981",
    emoji: "🌱",
  },
  {
    cefr: "A2" as const,
    label: "Elementary",
    desc: "Tingkatkan kosakata harianmu",
    gradient: "from-blue-400 to-indigo-500",
    gradientDark: "from-blue-500 to-indigo-600",
    glowColor: "shadow-blue-500/30",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-300 dark:border-blue-600/50",
    nodeActive: "from-blue-400 to-indigo-500",
    nodeGlow: "shadow-blue-500/50",
    ringColor: "#3B82F6",
    emoji: "📖",
  },
  {
    cefr: "B1" as const,
    label: "Intermediate",
    desc: "Level menengah, makin jago!",
    gradient: "from-violet-500 to-purple-600",
    gradientDark: "from-violet-600 to-purple-700",
    glowColor: "shadow-violet-500/30",
    badgeBg: "bg-violet-100 dark:bg-violet-900/50",
    badgeText: "text-violet-700 dark:text-violet-300",
    badgeBorder: "border-violet-300 dark:border-violet-600/50",
    nodeActive: "from-violet-500 to-purple-600",
    nodeGlow: "shadow-violet-500/50",
    ringColor: "#8B5CF6",
    emoji: "🚀",
  },
  {
    cefr: "B2" as const,
    label: "Upper Intermediate",
    desc: "Hampir setara native speaker!",
    gradient: "from-pink-500 to-rose-600",
    gradientDark: "from-pink-600 to-rose-700",
    glowColor: "shadow-pink-500/30",
    badgeBg: "bg-pink-100 dark:bg-pink-900/50",
    badgeText: "text-pink-700 dark:text-pink-300",
    badgeBorder: "border-pink-300 dark:border-pink-600/50",
    nodeActive: "from-pink-500 to-rose-500",
    nodeGlow: "shadow-pink-500/50",
    ringColor: "#EC4899",
    emoji: "🏆",
  },
  {
    cefr: "C1" as const,
    label: "Advanced",
    desc: "Kosakata level elite & dewa!",
    gradient: "from-amber-500 to-orange-600",
    gradientDark: "from-amber-600 to-orange-700",
    glowColor: "shadow-amber-500/30",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-300 dark:border-amber-600/50",
    nodeActive: "from-amber-400 to-orange-500",
    nodeGlow: "shadow-amber-500/50",
    ringColor: "#F59E0B",
    emoji: "👑",
  },
  {
    cefr: "TECH" as const,
    label: "Technology",
    desc: "Dunia IT, coding & digital",
    gradient: "from-cyan-400 to-sky-500",
    gradientDark: "from-cyan-500 to-sky-600",
    glowColor: "shadow-cyan-500/30",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/50",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    badgeBorder: "border-cyan-300 dark:border-cyan-600/50",
    nodeActive: "from-cyan-400 to-sky-500",
    nodeGlow: "shadow-cyan-500/50",
    ringColor: "#06B6D4",
    emoji: "💻",
  },
  {
    cefr: "BUSINESS" as const,
    label: "Business",
    desc: "Bisnis, finansial & karier",
    gradient: "from-yellow-400 to-amber-500",
    gradientDark: "from-yellow-500 to-amber-600",
    glowColor: "shadow-yellow-500/30",
    badgeBg: "bg-yellow-100 dark:bg-yellow-900/50",
    badgeText: "text-yellow-700 dark:text-yellow-300",
    badgeBorder: "border-yellow-300 dark:border-yellow-600/50",
    nodeActive: "from-yellow-400 to-amber-500",
    nodeGlow: "shadow-yellow-500/50",
    ringColor: "#EAB308",
    emoji: "🏢",
  },
  {
    cefr: "TRAVEL" as const,
    label: "Travel",
    desc: "Bandara, hotel & liburan",
    gradient: "from-sky-400 to-blue-500",
    gradientDark: "from-sky-500 to-blue-600",
    glowColor: "shadow-sky-500/30",
    badgeBg: "bg-sky-100 dark:bg-sky-900/50",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-300 dark:border-sky-600/50",
    nodeActive: "from-sky-400 to-blue-500",
    nodeGlow: "shadow-sky-500/50",
    ringColor: "#0EA5E9",
    emoji: "✈️",
  },
  {
    cefr: "SLANG" as const,
    label: "Slang & Idiom",
    desc: "Bahasa gaul native speaker",
    gradient: "from-fuchsia-500 to-pink-600",
    gradientDark: "from-fuchsia-600 to-pink-700",
    glowColor: "shadow-fuchsia-500/30",
    badgeBg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-300 dark:border-fuchsia-600/50",
    nodeActive: "from-fuchsia-500 to-pink-600",
    nodeGlow: "shadow-fuchsia-500/50",
    ringColor: "#D946EF",
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
  index,
}: {
  level: Level;
  status: NodeStatus;
  unitConfig: (typeof UNITS)[number];
  stars: number;
  onClick: () => void;
  index: number;
}) {
  const isCurrent = status === "current";
  const isDone = status === "completed";
  const isLocked = status === "locked";

  return (
    <div className="flex flex-col items-center gap-1.5 relative">
      {/* Pulsing ring for current node */}
      {isCurrent && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: -6,
              background: `radial-gradient(circle, ${unitConfig.ringColor}30, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              inset: -4,
              borderColor: unitConfig.ringColor + "60",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </>
      )}

      <motion.button
        onClick={!isLocked ? onClick : undefined}
        whileHover={!isLocked ? { scale: 1.15, y: -4 } : {}}
        whileTap={!isLocked ? { scale: 0.9 } : {}}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 20 }}
        className={`
          relative w-16 h-16 rounded-full
          flex items-center justify-center text-2xl
          shadow-lg transition-all duration-150
          ${isDone
            ? `bg-gradient-to-br ${unitConfig.nodeActive} shadow-lg ${unitConfig.nodeGlow}`
            : isCurrent
            ? `bg-gradient-to-br ${unitConfig.nodeActive} shadow-xl ${unitConfig.nodeGlow}`
            : "bg-slate-200 dark:bg-slate-700/80"
          }
          ${isLocked ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
        `}
      >
        {/* Inner circle */}
        {(isDone || isCurrent) && (
          <div className="absolute inset-1 rounded-full bg-white/15" />
        )}
        <span className="relative z-10 select-none text-2xl">
          {isDone ? "✅" : isLocked ? "🔒" : level.emoji}
        </span>

        {/* Level number badge */}
        {!isLocked && (
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white shadow-md
            ${isDone ? "bg-emerald-500" : "bg-white/30 backdrop-blur-sm border border-white/50"}`}>
            {level.level}
          </div>
        )}
      </motion.button>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.04 + 0.1 }}
        className={`
          text-[10px] font-black text-center leading-tight max-w-[80px]
          ${isDone
            ? "text-emerald-600 dark:text-emerald-400"
            : isCurrent
            ? "text-indigo-600 dark:text-indigo-300"
            : "text-slate-400 dark:text-slate-600"
          }
        `}
      >
        {level.title.replace(/^(A1|A2|B1|B2|C1|TECH|BUSINESS|TRAVEL|SLANG) — /, "")}
      </motion.span>

      {/* Stars */}
      {isDone && (
        <div className="flex gap-0.5">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-xs ${s <= stars ? "opacity-100" : "opacity-15 grayscale"}`}>
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* "MAIN!" bounce on current */}
      {isCurrent && (
        <motion.span
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="text-[9px] font-black uppercase tracking-widest"
          style={{ color: unitConfig.ringColor }}
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
  index,
}: {
  unit: (typeof UNITS)[number];
  completedCount: number;
  total: number;
  locked: boolean;
  index: number;
}) {
  const pct = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`relative rounded-3xl overflow-hidden mb-5 ${locked ? "opacity-50" : ""}`}
    >
      {/* Gradient header strip */}
      <div className={`bg-gradient-to-r ${unit.gradient} p-5`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
            {locked ? "🔒" : unit.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30`}>
                {unit.cefr}
              </span>
              <span className="text-xs font-bold text-white/80">{unit.label}</span>
            </div>
            <p className="text-white font-black text-sm">{unit.desc}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
              {completedCount}
            </span>
            <span className="text-white/60 font-bold text-sm">/{total}</span>
          </div>
        </div>

        {/* Progress bar */}
        {!locked && (
          <div className="mt-3">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/80 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 + 0.2 }}
              />
            </div>
            {pct === 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold text-xs mt-1.5 flex items-center gap-1"
              >
                <span>🎉</span> Unit selesai!
              </motion.p>
            )}
          </div>
        )}

        {locked && (
          <p className="mt-2 text-[11px] font-bold text-white/70">
            🔒 Selesaikan unit sebelumnya untuk membuka
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Milestone card ────────────────────────────────────────────────────────────
function InlineMilestoneCard({ unit }: { unit: (typeof UNITS)[number] }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`my-4 mx-2 p-5 rounded-3xl text-center bg-gradient-to-br ${unit.gradient} text-white shadow-2xl relative overflow-hidden`}
    >
      {["⭐", "✨", "🎉", "🌟"].map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-lg opacity-30"
          style={{ top: `${15 + i * 20}%`, left: i % 2 === 0 ? "4%" : "86%" }}
          animate={{ rotate: [0, 20, -20, 0], y: [0, -5, 0] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {s}
        </motion.span>
      ))}
      <div className="text-4xl mb-2">🏅</div>
      <p className="font-black text-base mb-0.5" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
        Unit {unit.cefr} Conquered!
      </p>
      <p className="font-semibold text-xs text-white/80">
        Luar biasa! Kamu telah menguasai {unit.label} 💪
      </p>
    </motion.div>
  );
}

// ── Main LearningPath component ───────────────────────────────────────────────
export default function LearningPath({ completedLevels, stars, onSelectLevel }: LearningPathProps) {
  const completedSet = new Set(completedLevels);
  let nodeIndex = 0;

  return (
    <div className="max-w-sm mx-auto pb-8">
      {UNITS.map((unit, unitIdx) => {
        const unitLevels = vocabularyData.filter((l) => l.cefr === unit.cefr);
        const completedInUnit = unitLevels.filter((l) => completedSet.has(l.level)).length;
        const unitComplete = completedInUnit === unitLevels.length && unitLevels.length > 0;

        const firstLevel = unitLevels[0];
        const unitLocked =
          firstLevel != null &&
          firstLevel.level > 1 &&
          !completedSet.has(firstLevel.level - 1) &&
          !completedSet.has(firstLevel.level);

        return (
          <div key={unit.cefr} className="mb-2">
            <UnitHeader
              unit={unit}
              completedCount={completedInUnit}
              total={unitLevels.length}
              locked={unitLocked}
              index={unitIdx}
            />

            {!unitLocked && (
              <div className="relative pb-2">
                {/* Connector line */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none w-px"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${unit.ringColor}40, transparent)`,
                  }}
                />

                {/* Level nodes in zigzag */}
                <div className="flex flex-col gap-8">
                  {unitLevels.map((level, i) => {
                    const status = getNodeStatus(level, completedSet);
                    const isLeft = i % 2 === 0;
                    const currentNodeIndex = nodeIndex++;

                    return (
                      <div
                        key={level.level}
                        className={`relative flex ${isLeft ? "justify-start pl-6" : "justify-end pr-6"}`}
                      >
                        <LevelNode
                          level={level}
                          status={status}
                          unitConfig={unit}
                          stars={stars[level.level] || 0}
                          onClick={() => onSelectLevel(level)}
                          index={currentNodeIndex}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {unitComplete && <InlineMilestoneCard unit={unit} />}
            <div className="h-6" />
          </div>
        );
      })}
    </div>
  );
}
