import { useEffect } from "react";
import { motion } from "framer-motion";
import type { HeadGesture } from "@/data/gameData";

interface HeadGesturePanelProps {
  required: HeadGesture;
  detected: HeadGesture | null;
  onComplete: () => void;
  onClearGesture: () => void;
}

export function HeadGesturePanel({ required, detected, onComplete, onClearGesture }: HeadGesturePanelProps) {
  useEffect(() => {
    onClearGesture();
  }, [required]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (detected === required) {
      const t = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [detected, required, onComplete]);

  const isNod = required === "nod";
  const isMatching = detected === required;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2 rounded-2xl border-3 p-3 shadow-lg md:gap-3 md:p-4"
      style={{
        background: isMatching ? "hsl(120, 40%, 92%)" : "hsl(0, 0%, 95%)",
        borderColor: isMatching ? "hsl(120, 40%, 60%)" : "hsl(0, 0%, 80%)",
        borderWidth: "3px",
        minWidth: "180px",
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: "hsl(25, 40%, 40%)" }}>
        {isNod ? "Nod your head YES ↕️" : "Shake your head NO ↔️"}
      </div>

      <motion.div
        className="text-4xl md:text-5xl"
        animate={isNod
          ? { y: [0, -8, 0, -8, 0] }
          : { x: [0, -8, 0, 8, 0] }
        }
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        {isNod ? "👆👇" : "👈👉"}
      </motion.div>

      <div className="text-xs md:text-sm" style={{ color: isMatching ? "hsl(120, 50%, 35%)" : "hsl(0, 0%, 50%)" }}>
        {isMatching ? "✅ Detected!" : "Move your head..."}
      </div>
    </motion.div>
  );
}
