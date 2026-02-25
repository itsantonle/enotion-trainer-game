import { motion, AnimatePresence } from "framer-motion";
import type { DialogLine } from "@/data/gameData";

interface DialogBoxProps {
  line: DialogLine | null;
  customerName?: string;
  onAdvance?: () => void;
  showContinue?: boolean;
}

function getSpeakerColor(speaker: string) {
  switch (speaker) {
    case "customer": return { bg: "hsl(45, 60%, 92%)", border: "hsl(35, 50%, 70%)", name: "hsl(25, 60%, 35%)" };
    case "mom": return { bg: "hsl(340, 40%, 92%)", border: "hsl(340, 40%, 70%)", name: "hsl(340, 50%, 40%)" };
    case "narrator": return { bg: "hsl(210, 30%, 92%)", border: "hsl(210, 30%, 70%)", name: "hsl(210, 40%, 40%)" };
    default: return { bg: "hsl(0, 0%, 95%)", border: "hsl(0, 0%, 80%)", name: "hsl(0, 0%, 30%)" };
  }
}

function getSpeakerLabel(speaker: string, customerName?: string) {
  switch (speaker) {
    case "customer": return customerName || "Customer";
    case "mom": return "Mama 👩";
    case "narrator": return "📝";
    default: return "";
  }
}

export function DialogBox({ line, customerName, onAdvance, showContinue }: DialogBoxProps) {
  if (!line) return null;

  const colors = getSpeakerColor(line.speaker);
  const label = getSpeakerLabel(line.speaker, customerName);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={line.text}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl cursor-pointer rounded-2xl border-3 p-3 shadow-lg md:max-w-2xl md:p-4"
        style={{
          background: colors.bg,
          borderColor: colors.border,
          borderWidth: "3px",
        }}
        onClick={showContinue ? onAdvance : undefined}
      >
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider md:mb-1 md:text-xs" style={{ color: colors.name }}>
          {label}
        </div>
        <p className="text-sm font-medium md:text-base lg:text-lg" style={{ color: "hsl(25, 30%, 20%)" }}>
          {line.text}
        </p>
        {showContinue && (
          <motion.div
            className="mt-1 text-right text-[10px] opacity-60 md:mt-2 md:text-xs"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Click to continue ▸
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
