"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types";

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  const handleNext = () => {
    if (step === 1 && !goal) return;
    if (step === 2 && !name.trim()) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ name: name.trim() || "Guest", targetCefr: "A1" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 text-center">
      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s === step ? "w-8 bg-blue-500" : s < step ? "w-4 bg-blue-300" : "w-4 bg-slate-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Tujuan */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Apa tujuan belajarmu?
            </h1>
            <p className="text-slate-500 dark:text-gray-400 font-bold mb-6">
              Pilih salah satu biar Mr. Cece bisa nyesuaiin!
            </p>

            <div className="flex flex-col gap-3">
              {[
                { id: "travel", icon: "✈️", text: "Jalan-jalan (Travel)" },
                { id: "work", icon: "💼", text: "Kerja / Karier" },
                { id: "study", icon: "📚", text: "Sekolah / Akademik" },
                { id: "fun", icon: "🎮", text: "Iseng aja biar pintar" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setGoal(item.id); setStep(2); }}
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl border-2 border-b-[6px] transition-all font-black text-left
                    active:border-b-[2px] active:translate-y-[4px]
                    ${goal === item.id
                      ? "border-blue-600 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200"
                      : "border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700"}
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Nama */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Siapa namamu?
            </h1>
            <p className="text-slate-500 dark:text-gray-400 font-bold mb-6">
              Biar kita makin akrab!
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik namamu..."
              className="w-full p-4 rounded-2xl border-2 border-slate-300 dark:border-gray-600 font-bold text-lg mb-6 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all text-center bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) handleNext(); }}
            />

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl font-black text-lg bg-blue-500 text-white border-2 border-blue-800 border-b-[6px] active:border-b-[2px] active:translate-y-[4px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Lanjut!
            </button>
          </motion.div>
        )}

        {/* STEP 3: Perkenalan Maskot */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="mb-6 w-48 h-48 drop-shadow-2xl"
            >
              <img
                src="/mascot.png"
                alt="Mr. Cece Maskot"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.className = "text-9xl flex items-center justify-center w-full h-full";
                  fallback.textContent = "🦍";
                  e.currentTarget.parentElement?.appendChild(fallback);
                }}
              />
            </motion.div>

            <div className="bg-white dark:bg-gray-800 border-2 border-b-[4px] border-slate-200 dark:border-gray-700 rounded-2xl px-6 py-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🦍</span>
                <span className="font-black text-blue-600 dark:text-blue-400">Mr. Cece</span>
              </div>
              <p className="text-slate-700 dark:text-gray-200 font-bold text-sm leading-relaxed">
                "Salam kenal, <strong>{name}</strong>! 👋<br/>
                Gue Mr. Cece — guru vocabularymu. Kita bakal belajar 3.000 kata Inggris Oxford bareng. Siap nggak?"
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-lg bg-blue-600 text-white border-2 border-blue-900 border-b-[6px] active:border-b-[2px] active:translate-y-[4px] transition-all"
            >
              LET'S GO!!! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
