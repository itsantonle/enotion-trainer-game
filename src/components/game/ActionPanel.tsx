import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChopMinigame } from "./minigames/ChopMinigame";
import { PackMinigame } from "./minigames/PackMinigame";
import { WeighMinigame } from "./minigames/WeighMinigame";
import { BagMinigame } from "./minigames/BagMinigame";
import { TakeMinigame } from "./minigames/TakeMinigame";
import type { ActionType } from "@/data/gameData";
import { Package, Scissors, ShoppingBag, Scale, Hand } from "lucide-react";

interface ActionPanelProps {
  correctAction: ActionType;
  choices: ActionType[];
  onCorrect: () => void;
  onWrong: () => void;
  useMinigames?: boolean;
}

const ACTION_CONFIG: Record<ActionType, { icon: typeof Hand; label: string; emoji: string; color: string }> = {
  take: { icon: Hand, label: "Take", emoji: "🤚", color: "hsl(200, 60%, 50%)" },
  chop: { icon: Scissors, label: "Chop", emoji: "✂️", color: "hsl(0, 60%, 50%)" },
  pack: { icon: Package, label: "Pack", emoji: "📦", color: "hsl(30, 60%, 50%)" },
  weigh: { icon: Scale, label: "Weigh", emoji: "⚖️", color: "hsl(270, 50%, 55%)" },
  bag: { icon: ShoppingBag, label: "Bag", emoji: "🛍️", color: "hsl(160, 50%, 45%)" },
};

const MINIGAME_MAP: Record<ActionType, React.ComponentType<any>> = {
  take: TakeMinigame,
  chop: ChopMinigame,
  pack: PackMinigame,
  weigh: WeighMinigame,
  bag: BagMinigame,
};

export function ActionPanel({ correctAction, choices, onCorrect, onWrong, useMinigames = false }: ActionPanelProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  // Reset selection whenever the set of choices or correct answer changes (new line/phase)
  useEffect(() => {
    setSelectedAction(null);
  }, [choices, correctAction]);

  // If minigames are enabled and an action hasn't been selected yet, show action buttons
  if (useMinigames && selectedAction === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2 md:gap-3"
      >
        <div className="text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: "hsl(25, 40%, 40%)" }}>
          Choose the right action:
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {choices.map((action, i) => {
            const config = ACTION_CONFIG[action];
            return (
              <motion.div
                key={`${action}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Button
                  onClick={() => setSelectedAction(action)}
                  className="flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold shadow-md md:gap-2 md:px-5 md:py-4 md:text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
                    color: "white",
                    borderColor: config.color + "80",
                  }}
                >
                  <span className="text-base md:text-xl">{config.emoji}</span>
                  <config.icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  {config.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // If minigames enabled and action selected, show the minigame
  if (useMinigames && selectedAction !== null) {
    const MinigameComponent = MINIGAME_MAP[selectedAction];
    const handleMinigameComplete = () => {
      setSelectedAction(null);
      if (selectedAction === correctAction) {
        onCorrect();
      } else {
        onWrong();
      }
    };

    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[560px]">
          <MinigameComponent
            onComplete={handleMinigameComplete}
            onFail={() => {
              if (selectedAction !== correctAction) {
                onWrong();
              }
              setSelectedAction(null);
            }}
          />
        </div>
      </div>
    );
  }

  // Default button-based UI (when minigames disabled)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2 md:gap-3"
    >
      <div className="text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: "hsl(25, 40%, 40%)" }}>
        Choose the right action:
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {choices.map((action, i) => {
          const config = ACTION_CONFIG[action];
          return (
            <motion.div
              key={`${action}-${i}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Button
                onClick={() => action === correctAction ? onCorrect() : onWrong()}
                className="flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold shadow-md md:gap-2 md:px-5 md:py-4 md:text-sm"
                style={{
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
                  color: "white",
                  borderColor: config.color + "80",
                }}
              >
                <span className="text-base md:text-xl">{config.emoji}</span>
                <config.icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                {config.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
