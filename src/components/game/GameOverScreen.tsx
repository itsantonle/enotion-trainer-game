import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface GameOverScreenProps {
  momMessage: string;
  score: number;
  level: number;
  onRestart: () => void;
}

export function GameOverScreen({ momMessage, score, level, onRestart }: GameOverScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "hsla(0, 20%, 10%, 0.85)" }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-3 sm:gap-4 rounded-2xl border-4 p-4 sm:p-6 shadow-2xl"
        style={{
          background: "hsl(0, 20%, 92%)",
          borderColor: "hsl(0, 40%, 60%)",
        }}
      >
        <motion.div
          className="text-4xl sm:text-5xl"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          😢
        </motion.div>

        <h2 className="text-lg sm:text-2xl font-bold" style={{ color: "hsl(0, 50%, 35%)" }}>
          Game Over!
        </h2>

        <div
          className="w-full rounded-xl border-2 p-2 sm:p-3 text-center"
          style={{
            background: "hsl(340, 40%, 92%)",
            borderColor: "hsl(340, 40%, 70%)",
          }}
        >
          <div className="text-xs sm:text-sm font-bold" style={{ color: "hsl(340, 50%, 40%)" }}>Mama says:</div>
          <p className="text-xs sm:text-base mt-1" style={{ color: "hsl(340, 30%, 25%)" }}>{momMessage}</p>
        </div>

        <div className="text-center w-full">
          <p className="text-xs sm:text-sm" style={{ color: "hsl(0, 20%, 40%)" }}>
            Reached Level {level} · Score: {score}
          </p>
          <p className="mt-1 text-[10px] sm:text-xs opacity-60">
            Reloading the page will restart from Level 1
          </p>
        </div>

        <Button
          size="lg"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-bold shadow-lg w-full sm:w-auto justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))",
            color: "hsl(40, 90%, 95%)",
          }}
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          Retrain (Restart)
        </Button>
      </motion.div>
    </div>
  );
}
