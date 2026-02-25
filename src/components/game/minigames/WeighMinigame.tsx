import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WeighMinigameProps {
  onComplete: () => void;
  onFail: () => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function WeighMinigame({ onComplete, onFail }: WeighMinigameProps) {
  const target = useRef(30 + Math.random() * 40); // percentage height
  const holdMsRequired = 2000;
  const [cursor, setCursor] = useState(50);
  const desiredCursor = useRef(50);
  const [holdMs, setHoldMs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12000);
  const [failed, setFailed] = useState(false);
  const tickRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const cursorLerpRef = useRef<number | null>(null);

  // Countdown overall timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setFailed(true);
      setTimeout(() => onFail(), 400);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tLeft => tLeft - 250), 250);
    return () => clearTimeout(t);
  }, [timeLeft, onFail]);

  // Smooth cursor position toward desiredCursor to reduce jitter
  useEffect(() => {
    const step = () => {
      setCursor(prev => {
        const next = prev + (desiredCursor.current - prev) * 0.25;
        return Math.abs(next - desiredCursor.current) < 0.1 ? desiredCursor.current : next;
      });
      cursorLerpRef.current = requestAnimationFrame(step);
    };
    cursorLerpRef.current = requestAnimationFrame(step);
    return () => {
      if (cursorLerpRef.current) cancelAnimationFrame(cursorLerpRef.current);
    };
  }, []);

  // Progress tracker when inside the target band (RAF to avoid jitter)
  useEffect(() => {
    const band = 10; // wider forgiveness
    const loop = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;
      const inBand = Math.abs(cursor - target.current) <= band;
      setHoldMs(ms => {
        const deltaMs = inBand ? delta : -delta * 0.9;
        const next = clamp(ms + deltaMs, 0, holdMsRequired);
        if (next >= holdMsRequired) {
          setTimeout(onComplete, 120);
        }
        return next;
      });
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      lastTs.current = null;
    };
  }, [cursor, onComplete]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percent = 100 - (y / rect.height) * 100;
    desiredCursor.current = clamp(percent, 0, 100);
  };

  const progressPct = Math.round((holdMs / holdMsRequired) * 100);
  const timePct = Math.round((timeLeft / 12000) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-purple-200/70 bg-white/95 p-4 shadow-md md:p-5"
      style={{ background: "hsl(270, 55%, 96%)" }}
    >
      <div className="text-center">
        <h3 className="font-bold text-purple-700">Balance the scale! ⚖️</h3>
        <p className="mt-1 text-xs text-purple-600">Hold your cursor in the glowing band until the bar fills.</p>
      </div>

      <div
        onMouseMove={handleMouseMove}
        className="relative flex h-48 w-full max-w-[320px] items-center justify-center rounded-xl border-2 border-purple-400 bg-gradient-to-b from-purple-50 to-purple-100"
        style={{ boxShadow: "0 0 0 14px hsla(270,70%,60%,0.15)" }}
      >
        <div className="absolute inset-y-6 left-8 w-10 rounded-full bg-purple-200/70" />
        <div className="absolute inset-y-10 right-8 w-3 rounded-full bg-purple-300/70" />

        {/* target band */}
        <div
          className="absolute left-1/2 h-12 w-36 -translate-x-1/2 rounded-lg border-2 border-purple-700/60 bg-purple-500/18"
          style={{ top: `${100 - target.current}%`, boxShadow: "0 0 0 10px hsla(270,70%,60%,0.14)" }}
        />

        {/* Cursor marker / weight */}
        <motion.div
          className="absolute left-1/2 flex h-8 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-purple-600 text-center text-xs font-bold text-white shadow-lg"
          style={{ top: `${100 - cursor}%`, boxShadow: "0 0 0 10px hsla(270,70%,60%,0.18)" }}
          animate={{ x: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          Balance here
        </motion.div>

        {/* Hanging weight visual */}
        <motion.div
          className="absolute left-[35%] top-6 h-24 w-10 rounded-full bg-purple-200/80"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[32%] top-28 h-6 w-16 rounded-md bg-purple-300/80"
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full">
        <div className="mb-1 flex items-center justify-between text-[11px] text-purple-700">
          <span>Hold meter</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-purple-300 bg-purple-100">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
            animate={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-purple-700">
          <span>Time left</span>
          <span>{Math.max(0, Math.ceil(timeLeft / 1000))}s</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-purple-200">
          <motion.div className="h-full bg-purple-700" animate={{ width: `${timePct}%` }} />
        </div>
      </div>

      {failed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-600">
          ❌ Time out! Try steadier control.
        </motion.div>
      )}

      <Button
        onClick={() => (progressPct >= 100 ? onComplete() : onFail())}
        className="rounded-lg px-6 py-2 text-sm font-bold"
        style={{
          background: progressPct >= 100
            ? "linear-gradient(135deg, hsl(270, 70%, 50%), hsl(270, 80%, 45%))"
            : "hsl(270, 30%, 70%)",
          color: "white",
        }}
      >
        {progressPct >= 100 ? "Balanced! ✓" : "Force finish"}
      </Button>
    </motion.div>
  );
}
