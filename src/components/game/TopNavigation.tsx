import { Coffee, Camera, CameraOff, Sparkles, Heart, Star, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TopNavigationProps {
  cameraOn?: boolean;
  onToggleCamera?: () => void;
  level?: number;
  score?: number;
  lives?: number;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function TopNavigation({ cameraOn = false, onToggleCamera = () => {}, level = 1, score = 0, lives = 2, collapsed = false, onToggleCollapsed = () => {} }: TopNavigationProps) {
  const heightClass = collapsed ? "py-1" : "py-2 md:py-3";
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      y: collapsed ? "-120%" : "0%",
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [collapsed]);

  return (
    <>
      <div
        ref={barRef}
        className={`fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-3 md:px-6 ${heightClass}`}
        style={{
          background: "linear-gradient(90deg, hsla(20, 45%, 12%, 0.92), hsla(30, 55%, 18%, 0.92))",
          borderBottom: "2px solid hsla(35, 60%, 50%, 0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
      <div className="flex items-center gap-2 md:gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-md"
          style={{ background: "hsla(25, 60%, 20%, 0.8)", border: "1px solid hsla(35, 70%, 55%, 0.5)" }}
        >
          <Coffee className="h-5 w-5 text-amber-300 md:h-6 md:w-6" />
          <div className="leading-tight">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-100">Enotion Trainer</div>
            <div className="text-[10px] text-amber-200/80">Sari-Sari Shift</div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <motion.div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-amber-50"
          style={{ background: "hsla(45, 70%, 25%, 0.65)", border: "1px solid hsla(45, 70%, 55%, 0.45)" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="h-4 w-4" />
          Level {level}
        </motion.div>

        <motion.div
          className="flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold text-amber-50"
          style={{ background: "hsla(45, 70%, 25%, 0.65)", border: "1px solid hsla(45, 70%, 55%, 0.45)" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Star className="h-4 w-4" />
          {score} pts
        </motion.div>

        <motion.div
          className="flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold text-amber-50"
          style={{ background: "hsla(0, 45%, 25%, 0.7)", border: "1px solid hsla(0, 70%, 55%, 0.4)" }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <Heart
              key={i}
              className="h-4 w-4 md:h-5 md:w-5"
              fill={i < lives ? "hsl(0, 70%, 55%)" : "transparent"}
              stroke={i < lives ? "hsl(0, 70%, 45%)" : "hsl(0, 10%, 60%)"}
            />
          ))}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCamera}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide shadow-lg md:text-sm"
          style={{
            background: cameraOn
              ? "linear-gradient(135deg, hsl(145, 60%, 42%), hsl(145, 65%, 35%))"
              : "linear-gradient(135deg, hsl(0, 70%, 45%), hsl(0, 75%, 38%))",
            color: "hsl(40, 95%, 96%)",
            border: "1px solid hsla(0, 0%, 100%, 0.18)",
          }}
        >
          {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          {cameraOn ? "Camera On" : "Camera Off"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapsed}
          className="hidden rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-50 shadow md:inline-flex"
          style={{ background: "hsla(0, 0%, 25%, 0.55)", border: "1px solid hsla(0, 0%, 55%, 0.5)" }}
        >
          Hide bar
        </motion.button>
      </div>
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapsed}
          className="fixed left-1/2 top-2 z-40 -translate-x-1/2 rounded-full bg-amber-800/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-50 shadow-lg"
        >
          <ChevronDown className="mr-1 inline h-4 w-4" /> Pull Down
        </button>
      )}
    </>
  );
}
