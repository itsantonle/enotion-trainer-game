import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PackMinigameProps {
  onComplete: () => void;
  onFail: () => void;
}

const STEPS = [
  { title: "Fold the box", emoji: "📦", hint: "Click the flaps to fold them in." },
  { title: "Add padding", emoji: "🧻", hint: "Tap the bubble wrap to lay it down." },
  { title: "Drop items", emoji: "🍜", hint: "Place each item inside in order." },
  { title: "Seal it", emoji: "📏", hint: "Drag the tape strip across the lid." },
];

export function PackMinigame({ onComplete, onFail }: PackMinigameProps) {
  const [step, setStep] = useState(0);
  const [itemsPlaced, setItemsPlaced] = useState(0);
  const [taped, setTaped] = useState(false);
  const [failed, setFailed] = useState(false);

  const advanceStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBoxClick = () => {
    if (step === 0) advanceStep();
  };

  const handlePadding = () => {
    if (step === 1) advanceStep();
  };

  const handleDropItem = () => {
    if (step !== 2) return;
    setItemsPlaced(v => {
      const next = v + 1;
      if (next >= 3) advanceStep();
      return next;
    });
  };

  const handleTape = () => {
    if (step === 3) {
      setTaped(true);
      setTimeout(onComplete, 400);
    } else {
      setFailed(true);
      setTimeout(() => onFail(), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-amber-200/70 bg-white/95 p-4 shadow-md md:p-5"
      style={{ background: "hsl(30, 55%, 96%)" }}
    >
      <div className="text-center">
        <h3 className="font-bold text-amber-700">Pack step-by-step 📦</h3>
        <p className="mt-1 text-xs text-amber-600">Finish all 4 stages without messing up the order.</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 text-[11px] text-amber-800">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="flex items-center gap-2 rounded-lg border px-2 py-1"
            style={{
              background: i === step ? "hsl(30, 70%, 85%)" : "hsl(30, 40%, 92%)",
              borderColor: i <= step ? "hsl(30, 70%, 50%)" : "hsl(30, 40%, 80%)",
            }}
          >
            <span className="text-lg">{s.emoji}</span>
            <span className="font-semibold">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-amber-400 bg-amber-50/70 p-4">
        <div className="text-center text-xs font-semibold text-amber-800">{STEPS[step].hint}</div>

        {/* Stage canvases */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-lg border-4 border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200" style={{ boxShadow: "0 0 0 10px hsla(30,70%,55%,0.16)" }}>
            <motion.div
              onClick={handleBoxClick}
              animate={{ scale: step === 0 ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: step === 0 ? Infinity : 0, duration: 0.8 }}
              className="text-4xl cursor-pointer"
            >
              📦
            </motion.div>
            {step >= 1 && (
              <motion.div
                onClick={handlePadding}
                className="absolute inset-4 rounded-md border-2 border-amber-500/60 bg-amber-100 text-3xl"
                animate={{ opacity: step === 1 ? [0.6, 1, 0.6] : 0.6 }}
                transition={{ repeat: step === 1 ? Infinity : 0, duration: 1 }}
              >
                <div className="flex h-full items-center justify-center">🧻</div>
              </motion.div>
            )}

            {step >= 2 && (
              <div className="absolute inset-6 grid grid-cols-2 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={handleDropItem}
                    disabled={i < itemsPlaced}
                    whileHover={i < itemsPlaced ? {} : { scale: 1.1 }}
                    whileTap={i < itemsPlaced ? {} : { scale: 0.9 }}
                    className="text-2xl cursor-pointer disabled:cursor-default"
                  >
                    {i < itemsPlaced ? "✅" : "🍜"}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 3 && (
              <motion.div
                onClick={handleTape}
                className="absolute inset-x-4 top-1/2 flex h-6 -translate-y-1/2 items-center justify-center rounded-md bg-amber-700 text-[10px] font-bold uppercase tracking-wide text-amber-50"
                animate={{ x: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {taped ? "Sealed!" : "Drag tape"}
              </motion.div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-xs text-amber-800">
            <div className="rounded-lg bg-amber-100 px-3 py-2 shadow-inner">Step {step + 1} / 4</div>
            <div className="rounded-lg bg-amber-100 px-3 py-2 shadow-inner">Items placed: {itemsPlaced}/3</div>
          </div>
        </div>
      </div>

      {failed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-600">
          ❌ Wrong step — restart the sequence.
        </motion.div>
      )}

      <Button
        onClick={() => (taped || step === STEPS.length - 1 ? onComplete() : onFail())}
        className="rounded-lg px-6 py-2 text-sm font-bold"
        style={{
          background: step >= STEPS.length - 1 && taped
            ? "linear-gradient(135deg, hsl(30, 70%, 50%), hsl(30, 80%, 45%))"
            : "hsl(30, 30%, 70%)",
          color: "white",
        }}
      >
        {step >= STEPS.length - 1 && taped ? "Box Ready ✓" : "Finish packing"}
      </Button>
    </motion.div>
  );
}
