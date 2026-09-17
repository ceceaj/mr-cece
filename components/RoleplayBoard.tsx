"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RoleplayBoardProps {
  onBackToMenu: () => void;
}

interface Message {
  role: "user" | "model";
  text: string;
}

const SCENARIOS = [
  { id: "coffee", title: "Ordering Coffee", emoji: "☕", desc: "Berlatih memesan kopi dan makanan ringan." },
  { id: "airport", title: "Airport Check-in", emoji: "✈️", desc: "Melewati petugas check-in di bandara." },
  { id: "job", title: "Job Interview", emoji: "💼", desc: "Wawancara kerja singkat dalam bahasa Inggris." },
];

export default function RoleplayBoard({ onBackToMenu }: RoleplayBoardProps) {
  const [scenario, setScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [grammarFeedback, setGrammarFeedback] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === "aborted") {
            console.log("Speech recognition dihentikan (normal karena tombol dilepas cepat).");
          } else if (event.error === "no-speech") {
            console.log("Tidak ada suara yang terdeteksi.");
          } else {
            console.error("Speech recognition error:", event.error);
          }
          isRecordingRef.current = false;
          setIsRecording(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isRecordingRef = useRef(false);

  const startRecording = () => {
    setGrammarFeedback(null);
    if (recognitionRef.current) {
      if (isRecordingRef.current) return;
      isRecordingRef.current = true;
      setTranscript("");
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recording", e);
        isRecordingRef.current = false;
        setIsRecording(false);
      }
    } else {
      alert("Browser Anda tidak mendukung fitur mikrofon. Coba gunakan Google Chrome.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecordingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      isRecordingRef.current = false;
      setIsRecording(false);
      if (transcript.trim().length > 0) {
        handleSendMessage(transcript.trim());
      }
      setTranscript("");
    }
  };

  const handleSendMessage = async (text: string) => {
    const newMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const selected = SCENARIOS.find(s => s.id === scenario);
      const res = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages,
          userMessage: text,
          scenario: selected?.title || "Casual Chat"
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "model", text: data.reply }]);
        setGrammarFeedback(data.grammarFeedback);
        speak(data.reply);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!scenario) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 px-4 py-8 relative">
        <button
          onClick={onBackToMenu}
          className="absolute top-4 left-4 w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center font-black text-slate-500 z-10 active:translate-y-[2px] active:border-b-[2px]"
        >
          ←
        </button>
        <div className="text-center mt-12 mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">AI Roleplay 🎙️</h1>
          <p className="text-slate-500 dark:text-gray-400 font-bold mt-2">Pilih skenario percakapan</p>
        </div>
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setScenario(s.id);
                setMessages([{ role: "model", text: `Hi! Welcome to the ${s.title.toLowerCase()}. How can I help you today?` }]);
                speak(`Hi! Welcome to the ${s.title.toLowerCase()}. How can I help you today?`);
              }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-3xl border-2 border-b-[6px] border-indigo-500 hover:border-indigo-400 active:border-b-[2px] active:translate-y-[4px] shadow-lg shadow-indigo-500/10 transition-all flex items-center gap-4 text-left group"
            >
              <span className="text-4xl">{s.emoji}</span>
              <div>
                <h3 className="font-black text-lg text-slate-800 dark:text-white">{s.title}</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-gray-400">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedScenario = SCENARIOS.find(s => s.id === scenario);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-900 relative">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-slate-200 dark:border-gray-700 px-4 py-4 shrink-0 z-10 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setScenario(null)}
          className="w-10 h-10 rounded-xl border-2 border-b-[4px] border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center font-black text-slate-500 active:translate-y-[2px] active:border-b-[2px]"
        >
          ←
        </button>
        <div>
          <h2 className="font-black text-slate-800 dark:text-white leading-tight">
            {selectedScenario?.emoji} {selectedScenario?.title}
          </h2>
          <p className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> AI Online
          </p>
        </div>
      </div>

      {/* Chat Log */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              m.role === "user" 
                ? "bg-indigo-500 text-white rounded-br-none shadow-md shadow-indigo-500/20" 
                : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-slate-200 dark:border-gray-700 text-slate-800 dark:text-white rounded-bl-none shadow-sm"
            }`}>
              <p className="font-medium text-[15px]">{m.text}</p>
            </div>
          </motion.div>
        ))}
        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-4 rounded-2xl bg-indigo-400 text-white rounded-br-none opacity-70">
              <p className="font-medium text-[15px] italic">{transcript}...</p>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-slate-200 dark:border-gray-700 rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grammar Feedback Bubble */}
      <AnimatePresence>
        {grammarFeedback && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 pb-2"
          >
            <div className={`p-3 rounded-2xl border-2 text-sm font-bold flex gap-3 items-start ${
              grammarFeedback.toLowerCase().includes("sempurna")
                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 text-emerald-700 dark:text-emerald-300"
                : "bg-orange-50 dark:bg-orange-900/30 border-orange-200 text-orange-700 dark:text-orange-300"
            }`}>
              <span>🤖</span>
              <span>{grammarFeedback}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Button Area */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 border-t-2 border-slate-200 dark:border-gray-700 flex justify-center shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          disabled={isLoading}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all shadow-xl
            ${isRecording 
              ? "bg-red-500 scale-110 shadow-red-500/50" 
              : "bg-indigo-500 shadow-indigo-500/40 active:scale-95"}
            ${isLoading ? "opacity-50 grayscale cursor-not-allowed" : ""}
          `}
        >
          {isRecording ? "🔴" : "🎙️"}
        </button>
      </div>
      <p className="text-center text-xs font-bold text-slate-400 dark:text-gray-500 pb-4 bg-white dark:bg-gray-800">
        Tahan tombol untuk berbicara
      </p>
    </div>
  );
}
