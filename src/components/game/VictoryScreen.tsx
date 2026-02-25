import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";

interface VictoryScreenProps {
  momMessage: string;
  score: number;
  onRestart: () => void;
}

export function VictoryScreen({ momMessage, score, onRestart }: VictoryScreenProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6"
      style={{
        background: "linear-gradient(180deg, hsl(45, 70%, 80%) 0%, hsl(30, 60%, 65%) 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-4 sm:gap-6 rounded-2xl border-4 p-4 sm:p-8 shadow-2xl"
        style={{
          background: "hsl(45, 70%, 95%)",
          borderColor: "hsl(45, 60%, 55%)",
        }}
      >
        {/* Confetti emojis */}
        <div className="flex gap-2 text-2xl sm:text-3xl">
          {["🎉", "🏆", "🎊"].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -15, 0], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center" style={{ color: "hsl(30, 60%, 30%)" }}>
          🇵🇭 Nay, Tapos Na!
        </h2>
        <p className="text-base sm:text-lg text-center" style={{ color: "hsl(30, 40%, 40%)" }}>
          You served all 6 customers!
        </p>

        <div
          className="w-full rounded-xl border-2 p-2 sm:p-4 text-center"
          style={{
            background: "hsl(340, 40%, 92%)",
            borderColor: "hsl(340, 40%, 70%)",
          }}
        >
          <div className="text-xs sm:text-sm font-bold" style={{ color: "hsl(340, 50%, 40%)" }}>Mama says:</div>
          <p className="text-xs sm:text-base mt-1" style={{ color: "hsl(340, 30%, 25%)" }}>{momMessage}</p>
        </div>

        <div className="flex items-center gap-2 text-lg sm:text-xl font-bold" style={{ color: "hsl(45, 60%, 35%)" }}>
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6" /> Final Score: {score}
        </div>

        <Button
          size="lg"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-lg font-bold shadow-lg w-full sm:w-auto justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))",
            color: "hsl(40, 90%, 95%)",
          }}
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}
