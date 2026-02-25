import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TakeMinigameProps {
  onComplete: () => void;
  onFail: () => void;
}

export function TakeMinigame({ onComplete, onFail }: TakeMinigameProps) {
  const [taps, setTaps] = useState(0);
  const [failed, setFailed] = useState(false);
  const requiredTaps = 2;

  const handleTake = () => {
    setTaps(prev => prev + 1);
  };

  const handleComplete = () => {
    if (taps >= requiredTaps) {
      onComplete();
    } else {
      setFailed(true);
      setTimeout(() => onFail(), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-blue-200/70 bg-white/95 p-4 shadow-md md:p-5"
      style={{ background: "hsl(200, 55%, 96%)" }}
    >
      <div className="text-center">
        <h3 className="font-bold text-blue-700">Take the item! 🤚</h3>
        <p className="mt-1 text-xs text-blue-600">Click to grab the item</p>
      </div>

      {/* Item shelf */}
      <div
        className="relative flex h-40 w-full max-w-[280px] items-center justify-center rounded-lg border-2 border-blue-400 p-4"
        style={{ background: "linear-gradient(to bottom, hsl(200, 40%, 90%) 0%, hsl(200, 30%, 95%) 100%)", boxShadow: "0 0 0 8px hsla(200,70%,55%,0.12)" }}
      >
        <motion.button
          onClick={handleTake}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          disabled={taps >= requiredTaps}
          animate={taps >= requiredTaps ? { opacity: 0.3, x: 100 } : { opacity: 1, x: 0 }}
          className="relative text-5xl cursor-pointer disabled:cursor-default transition-all"
          style={{ boxShadow: taps >= requiredTaps ? "none" : "0 0 0 8px hsla(200,70%,60%,0.15)", borderRadius: "16px" }}
        >
          {taps >= requiredTaps ? "✨" : "🥫"}
        </motion.button>

        {/* Shelves */}
        <div className="absolute left-0 right-0 flex gap-4 px-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-1 flex-1 rounded" style={{ background: "hsl(200, 60%, 50%)" }} />
          ))}
        </div>
      </div>

      {/* Take counter */}
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-700">{taps}/{requiredTaps}</p>
        <p className="mt-1 text-xs text-blue-600">Times taken</p>
      </div>

      {/* Progress animation */}
      <div className="flex gap-2">
        {Array.from({ length: requiredTaps }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={i < taps ? { scale: 1 } : { scale: 0.5, opacity: 0.3 }}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
            style={{
              background: i < taps ? "hsl(200, 70%, 50%)" : "hsl(200, 20%, 80%)",
              color: "white",
            }}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>

      {failed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-bold text-red-600"
        >
          ❌ Take again!
        </motion.div>
      )}

      <Button
        onClick={handleComplete}
        disabled={taps < requiredTaps}
        className="rounded-lg px-6 py-2 font-bold text-sm"
        style={{
          background: taps >= requiredTaps
            ? "linear-gradient(135deg, hsl(200, 70%, 50%), hsl(200, 80%, 45%))"
            : "hsl(200, 30%, 70%)",
          color: "white",
        }}
      >
        {taps >= requiredTaps ? "Taken! ✓" : `Take more (${requiredTaps - taps})`}
      </Button>
    </motion.div>
  );
}
