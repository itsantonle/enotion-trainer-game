import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BagMinigameProps {
  onComplete: () => void;
  onFail: () => void;
}

export function BagMinigame({ onComplete, onFail }: BagMinigameProps) {
  const [baggedItems, setBaggedItems] = useState(0);
  const [failed, setFailed] = useState(false);
  const requiredItems = 4;

  const handleItemClick = () => {
    setBaggedItems(prev => prev + 1);
  };

  const handleComplete = () => {
    if (baggedItems >= requiredItems) {
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
      className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-teal-200/70 bg-white/95 p-4 shadow-md md:p-5"
      style={{ background: "hsl(160, 55%, 96%)" }}
    >
      <div className="text-center">
        <h3 className="font-bold text-teal-700">Bag the items! 🛍️</h3>
        <p className="mt-1 text-xs text-teal-600">Click on items to bag them</p>
      </div>

      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {/* Items grid */}
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-teal-200/80 bg-white/70 p-3 shadow-inner" style={{ boxShadow: "0 0 0 8px hsla(160,70%,50%,0.14)" }}>
          {Array.from({ length: requiredItems }).map((_, i) => (
            <motion.button
              key={i}
              onClick={handleItemClick}
              disabled={i < baggedItems}
              animate={i < baggedItems ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              whileHover={i < baggedItems ? {} : { scale: 1.15 }}
              whileTap={i < baggedItems ? {} : { scale: 0.85 }}
              className="text-3xl cursor-pointer disabled:cursor-default"
            >
              {i < baggedItems ? "✓" : "📦"}
            </motion.button>
          ))}
        </div>

        {/* Shopping bag */}
        <div
          className="relative flex h-40 w-32 flex-col items-center justify-center gap-1 rounded-lg border-4"
          style={{ background: "hsl(160, 40%, 80%)", borderColor: "hsl(160, 60%, 50%)", boxShadow: "0 0 0 10px hsla(160,70%,45%,0.14)" }}
        >
          <motion.div
            animate={{ scale: baggedItems > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: baggedItems > 0 ? 3 : 0, duration: 0.6 }}
          >
            <div className="text-4xl">🛍️</div>
          </motion.div>
          <p className="text-xs font-bold text-teal-700">{baggedItems}/{requiredItems}</p>
          
          {/* Items inside bag visualization */}
          {baggedItems > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-1">
              {Array.from({ length: Math.min(baggedItems, 3) }).map((_, i) => (
                <span key={i} className="text-xs">📦</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {failed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-bold text-red-600"
        >
          ❌ Bag more items!
        </motion.div>
      )}

      <Button
        onClick={handleComplete}
        disabled={baggedItems < requiredItems}
        className="rounded-lg px-6 py-2 font-bold text-sm"
        style={{
          background: baggedItems >= requiredItems
            ? "linear-gradient(135deg, hsl(160, 70%, 50%), hsl(160, 80%, 45%))"
            : "hsl(160, 30%, 70%)",
          color: "white",
        }}
      >
        {baggedItems >= requiredItems ? "All bagged! ✓" : `Bag more (${requiredItems - baggedItems})`}
      </Button>
    </motion.div>
  );
}
