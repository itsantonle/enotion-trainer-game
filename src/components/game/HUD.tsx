import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HUDProps {
  level: number;
  lives: number;
  score: number;
  customerName?: string;
  offsetTop?: number;
  showLives?: boolean;
  showScore?: boolean;
}

export function HUD({ level, lives, score, customerName, offsetTop = 0, showLives = false, showScore = true }: HUDProps) {
  return (
    <div
      className="absolute left-0 right-0 z-20 flex items-center justify-between px-2 py-1.5 md:px-4 md:py-3"
      style={{ top: `${offsetTop}px` }}
    >
      {/* Level info - more visible */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-lg md:gap-3 md:px-4 md:py-2"
        style={{
          background: "hsla(25, 50%, 15%, 0.85)",
          backdropFilter: "blur(8px)",
          border: "2px solid hsl(35, 70%, 55%)",
        }}
      >
        <span className="text-xs font-bold md:text-sm" style={{ color: "hsl(35, 80%, 60%)" }}>
          Level {level}/6
        </span>
        {customerName && (
          <span className="text-[10px] md:text-xs" style={{ color: "hsl(35, 50%, 75%)" }}>
            — {customerName}
          </span>
        )}
      </motion.div>

      {/* Score */}
      {showScore && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-xl px-3 py-1.5 shadow-lg md:px-4 md:py-2"
          style={{
            background: "hsla(45, 60%, 20%, 0.85)",
            backdropFilter: "blur(8px)",
            border: "2px solid hsl(45, 60%, 55%)",
          }}
        >
          <span className="text-xs font-bold md:text-sm" style={{ color: "hsl(45, 80%, 65%)" }}>
            ⭐ {score}
          </span>
        </motion.div>
      )}

      {showLives && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-1 rounded-xl px-3 py-1.5 shadow-lg md:px-4 md:py-2"
          style={{
            background: "hsla(0, 40%, 15%, 0.85)",
            backdropFilter: "blur(8px)",
            border: "2px solid hsl(0, 50%, 55%)",
          }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              animate={i < lives ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
            >
              <Heart
                className="h-4 w-4 md:h-5 md:w-5"
                fill={i < lives ? "hsl(0, 70%, 55%)" : "transparent"}
                stroke={i < lives ? "hsl(0, 70%, 45%)" : "hsl(0, 10%, 50%)"}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
