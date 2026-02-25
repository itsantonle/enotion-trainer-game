import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChopMinigameProps {
  onComplete: () => void;
  onFail: () => void;
}

export function ChopMinigame({ onComplete, onFail }: ChopMinigameProps) {
  const [chewMeter, setChewMeter] = useState(0);
  const [isBiting, setIsBiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const progressAlongGuide = useRef(0);

  const handleMouseDown = () => {
    setIsBiting(true);
  };

  const handleMouseUp = () => {
    setIsBiting(false);
    lastPoint.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isBiting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (lastPoint.current) {
      const dx = pos.x - lastPoint.current.x;
      const dy = pos.y - lastPoint.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const nearGuide = Math.abs(pos.x - rect.width / 2) < 20; // keep strokes near the dashed line
      const mostlyVertical = Math.abs(dy) > Math.abs(dx) * 2;
      const goingDown = dy > 0;
      if (distance > 4 && nearGuide && mostlyVertical && goingDown) {
        progressAlongGuide.current = Math.min(rect.height, progressAlongGuide.current + Math.abs(dy));
        const completeness = Math.min(1, progressAlongGuide.current / rect.height);
        setChewMeter(Math.round(completeness * 100));
      }
    }
    lastPoint.current = pos;
  };

  const handleComplete = () => {
    if (chewMeter >= 90) {
      onComplete();
    } else {
      setFailed(true);
      setTimeout(() => onFail(), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-orange-200/70 bg-white/95 p-4 shadow-md md:p-5"
      style={{ background: "hsl(0, 55%, 96%)" }}
    >
      <div className="text-center">
        <h3 className="font-bold text-orange-700">Chomp-chop! 😮‍💨</h3>
        <p className="mt-1 text-xs text-orange-600">Click and drag in swooping mouth motions to slice through.</p>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        className="relative flex h-36 w-full max-w-[320px] cursor-pointer select-none items-center justify-center overflow-hidden rounded-lg border-2 border-orange-400 bg-gradient-to-b from-orange-100 to-orange-50"
        style={{ boxShadow: "0 0 0 12px hsla(20,80%,60%,0.16)" }}
      >
        <motion.div animate={{ scale: isBiting ? 0.9 : 1 }} className="text-6xl">
          🥕
        </motion.div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-full w-0.5 border-l-2 border-dashed border-orange-500/70 shadow-[0_0_12px_rgba(234,88,12,0.35)]" />
        </div>
        <motion.div
          className="absolute inset-0 text-5xl opacity-30"
          animate={isBiting ? { rotate: [0, 6, -6, 0] } : { rotate: 0 }}
          transition={{ repeat: isBiting ? Infinity : 0, duration: 0.6 }}
        >
          😮
        </motion.div>

        {/* Cut path breadcrumbs */}
        {chewMeter > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2={`${chewMeter}%`}
              stroke="hsl(20, 85%, 50%)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.35}
            />
          </svg>
        )}
      </div>

      <div className="w-full">
        <div className="mb-1 flex items-center justify-between text-xs text-orange-700">
          <span>Chop along the guide</span>
          <span>{Math.round(chewMeter)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-orange-300 bg-orange-100">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
            animate={{ width: `${chewMeter}%` }}
            transition={{ type: "spring", stiffness: 120 }}
          />
        </div>
      </div>

      {failed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-600">
          ❌ Bigger chomp strokes!
        </motion.div>
      )}

      <Button
        onClick={handleComplete}
        disabled={chewMeter < 90}
        className="rounded-lg px-6 py-2 text-sm font-bold"
        style={{
          background: chewMeter >= 90
            ? "linear-gradient(135deg, hsl(0, 70%, 50%), hsl(0, 80%, 45%))"
            : "hsl(0, 30%, 70%)",
          color: "white",
        }}
      >
        {chewMeter >= 90 ? "Sliced! ✓" : `Keep chewing (${Math.max(0, 90 - Math.round(chewMeter))}%)`}
      </Button>
    </motion.div>
  );
}
