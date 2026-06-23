"use client";

import { motion } from "framer-motion";

interface HeartsProps {
  hearts: number;
  maxHearts?: number;
}

export default function Hearts({ hearts, maxHearts = 5 }: HeartsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <motion.span
          key={i}
          className="text-xl leading-none"
          animate={
            i >= hearts
              ? { scale: [1, 0.8, 1], opacity: 0.25 }
              : { scale: 1, opacity: 1 }
          }
          transition={
            i >= hearts
              ? { duration: 0.3 }
              : { duration: 0.3 }
          }
        >
          {i < hearts ? "❤️" : "🖤"}
        </motion.span>
      ))}
    </div>
  );
}
