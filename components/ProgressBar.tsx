"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0–1
  total: number;
  matched: number;
}

export default function ProgressBar({ progress, total, matched }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs font-bold text-slate-500 shrink-0">
        {matched}/{total}
      </span>
      <div className="relative flex-1 h-5 bg-slate-200 rounded-full border-2 border-black overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        />
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
      </div>
      {/* Star sparkle at the end */}
      <motion.span
        className="text-xl shrink-0"
        animate={progress >= 1 ? { scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        ⭐
      </motion.span>
    </div>
  );
}
