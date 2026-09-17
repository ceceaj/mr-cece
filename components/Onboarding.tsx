"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types";

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const GOALS = [
  { id: "travel", icon: "✈️", title: "Jalan-jalan", desc: "Lancar ngobrol saat traveling" },
  { id: "work", icon: "💼", title: "Karier", desc: "Profesional di dunia kerja" },
  { id: "study", icon: "🎓", title: "Akademik", desc: "Sukses di sekolah/kampus" },
  { id: "fun", icon: "🎮", title: "Suka-suka", desc: "Belajar santai, biar makin jago" },
];

const AVATARS = [
  { id: "gorilla", emoji: "🦍", label: "Gorilla" },
  { id: "rocket", emoji: "🚀", label: "Roket" },
  { id: "lion", emoji: "🦁", label: "Singa" },
  { id: "wizard", emoji: "🧙", label: "Wizard" },
  { id: "ninja", emoji: "🥷", label: "Ninja" },
  { id: "robot", emoji: "🤖", label: "Robot" },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [avatar, setAvatar] = useState("gorilla");

  const totalSteps = 4;

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return !!goal;
    if (step === 2) return name.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete({ name: name.trim() || "Pejuang", targetCefr: "A1" });
    }
  };

  const selectedAvatar = AVATARS.find(a => a.id === avatar) || AVATARS[0];

  return (
    <div className="min-h-screen dark:mesh-bg mesh-bg-light flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 rounded-full bg-gradient-to-tr from-violet-400/20 to-pink-500/20 blur-3xl pointer-events-none" />

      {/* Logo top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
          <span className="text-base">🦍</span>
        </div>
        <span className="font-black text-lg text-slate-800 dark:text-white gradient-text" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
          Mr. Cece
        </span>
      </motion.div>

      {/* Progress indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 28 : 8,
              backgroundColor: i <= step ? "#6366F1" : "#CBD5E1"
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-16">
        <AnimatePresence mode="wait">

          {/* STEP 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-8xl mb-6 drop-shadow-2xl"
              >
                🦍
              </motion.div>

              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Halo! Gue <span className="gradient-text">Mr. Cece</span> 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Guru vocabulary paling seru se-Indonesia! Bareng gue, lo bakal nguasain <strong className="text-indigo-600 dark:text-indigo-400">3.000+ kata Inggris</strong> sambil have fun!
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                {[
                  { icon: "🎮", label: "Game seru" },
                  { icon: "🏆", label: "Leaderboard" },
                  { icon: "🤖", label: "AI Tutor" },
                ].map((f) => (
                  <div key={f.label} className="premium-card p-3 text-center">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{f.label}</p>
                  </div>
                ))}
              </div>

              <motion.button
                id="onboarding-start"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
              >
                Mulai Sekarang! 🚀
              </motion.button>
            </motion.div>
          )}

          {/* STEP 1: Goal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Apa tujuan belajarmu? 🎯
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                  Biar Mr. Cece bisa nyesuaiin materi yang pas!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {GOALS.map((item, i) => (
                  <motion.button
                    key={item.id}
                    id={`goal-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { setGoal(item.id); setStep(2); }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      p-4 rounded-2xl border-2 text-left transition-all
                      ${goal === item.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg shadow-indigo-500/20"
                        : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-600/50"
                      }
                    `}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="font-black text-sm text-slate-800 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Name */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Siapa namamu? ✨
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                  Biar kita makin akrab dan seru!
                </p>
              </div>

              <div className="mb-6">
                <input
                  id="onboarding-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ketik namamu..."
                  className="w-full p-4 rounded-2xl font-bold text-lg mb-2 text-center bg-white dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 input-premium"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleNext(); }}
                />
                {name.trim() && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm font-bold text-indigo-500 dark:text-indigo-400"
                  >
                    Halo, <strong>{name.trim()}</strong>! 🎉
                  </motion.p>
                )}
              </div>

              <motion.button
                id="onboarding-name-next"
                onClick={handleNext}
                disabled={!name.trim()}
                whileHover={name.trim() ? { scale: 1.02 } : {}}
                whileTap={name.trim() ? { scale: 0.97 } : {}}
                className="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Lanjut!
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3: Avatar pick + Intro */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex flex-col items-center text-center"
            >
              {/* Avatar display */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-7xl mb-4 drop-shadow-2xl"
              >
                {selectedAvatar.emoji}
              </motion.div>

              <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                Pilih Avatarmu! 🎨
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-5">
                Ini identitasmu di leaderboard
              </p>

              {/* Avatar grid */}
              <div className="grid grid-cols-6 gap-2 w-full mb-6">
                {AVATARS.map((av) => (
                  <motion.button
                    key={av.id}
                    id={`avatar-${av.id}`}
                    onClick={() => setAvatar(av.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      w-full aspect-square rounded-2xl text-2xl flex items-center justify-center border-2 transition-all
                      ${avatar === av.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-lg shadow-indigo-500/20 scale-110"
                        : "border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40"
                      }
                    `}
                  >
                    {av.emoji}
                  </motion.button>
                ))}
              </div>

              {/* Intro bubble */}
              <div className="w-full premium-card p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🦍</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">Mr. Cece</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm leading-relaxed">
                  &quot;Salam kenal, <strong>{name || "Pejuang"}!</strong> 🎉<br />
                  Siap nguasain kosakata Inggris bareng gue? Let&apos;s go, kita mulai dari level basic dulu!&quot;
                </p>
              </div>

              <motion.button
                id="onboarding-finish"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 shadow-2xl shadow-indigo-500/40"
              >
                LET&apos;S GO!!! 🚀
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
