import { motion } from "framer-motion";
import type { Emotion } from "@/data/gameData";
import { Progress } from "@/components/ui/progress";

interface EmotionIndicatorProps {
  requiredEmotion: Emotion;
  currentEmotion: Emotion;
  progress: number;
  duration: number;
  warning: boolean;
  warningCountdown: number;
}

const EMOTION_CONFIG: Record<Emotion, { emoji: string; label: string; color: string }> = {
  happy: { emoji: "😊", label: "Happy", color: "hsl(45, 80%, 50%)" },
  sad: { emoji: "😢", label: "Sad", color: "hsl(220, 60%, 55%)" },
  angry: { emoji: "😠", label: "Angry", color: "hsl(0, 70%, 50%)" },
  disgusted: { emoji: "🤢", label: "Disgusted", color: "hsl(100, 40%, 40%)" },
  surprised: { emoji: "😲", label: "Surprised", color: "hsl(280, 60%, 55%)" },
  neutral: { emoji: "😐", label: "Neutral", color: "hsl(160, 40%, 45%)" },
};

export function EmotionIndicator({ requiredEmotion, currentEmotion, progress, duration, warning, warningCountdown }: EmotionIndicatorProps) {
  const config = EMOTION_CONFIG[requiredEmotion];
  const isMatching = currentEmotion === requiredEmotion;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2 rounded-2xl border-3 p-3 shadow-lg md:gap-3 md:p-4"
      style={{
        background: warning ? "hsl(0, 60%, 95%)" : isMatching ? config.color + "20" : "hsl(0, 0%, 95%)",
        borderColor: warning ? "hsl(0, 70%, 50%)" : isMatching ? config.color : "hsl(0, 0%, 80%)",
        borderWidth: "3px",
        minWidth: "160px",
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: "hsl(25, 40%, 40%)" }}>
        Make this face:
      </div>

      <motion.div
        className="text-3xl md:text-5xl"
        animate={isMatching ? { scale: [1, 1.2, 1] } : warning ? { scale: [1, 0.9, 1] } : { scale: 1 }}
        transition={{ repeat: isMatching || warning ? Infinity : 0, duration: 0.5 }}
      >
        {config.emoji}
      </motion.div>

      <div className="text-xs font-bold md:text-sm" style={{ color: config.color }}>
        {config.label}
      </div>

      <div className="w-full max-w-[200px]">
        <Progress
          value={progress}
          className="h-2 md:h-3"
          style={{ background: "hsl(0, 0%, 88%)" }}
        />
      </div>

      {/* Warning */}
      {warning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg px-3 py-1 text-xs font-bold md:text-sm"
          style={{ background: "hsl(0, 70%, 50%)", color: "white" }}
        >
          ⚠️ Wrong face! Change in {warningCountdown}s!
        </motion.div>
      )}

      {!warning && (
        <div className="text-[10px] md:text-xs" style={{ color: isMatching ? "hsl(140, 50%, 35%)" : "hsl(0, 60%, 45%)" }}>
          {isMatching ? "✅ Hold it!" : "❌ Not matching"}
        </div>
      )}

      <div className="text-[9px] opacity-50 md:text-[10px]">
        Hold for {duration.toFixed(1)}s
      </div>
    </motion.div>
  );
}
