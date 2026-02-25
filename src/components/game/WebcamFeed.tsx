import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Emotion } from "@/data/gameData";

interface WebcamFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentEmotion?: Emotion;
  cameraOn?: boolean;
  variant?: "floating" | "docked";
  showLandmarks?: boolean;
  landmarks?: any[] | null;
}

const EMOTION_EMOJI: Record<Emotion, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  disgusted: "🤢",
  surprised: "😲",
  neutral: "😐",
};

export function WebcamFeed({ videoRef, currentEmotion, cameraOn = true, variant = "floating", showLandmarks = false, landmarks }: WebcamFeedProps) {
  const isFloating = variant === "floating";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!showLandmarks || !landmarks || !canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = videoRef.current;
    const width = video.videoWidth || canvas.clientWidth || 320;
    const height = video.videoHeight || canvas.clientHeight || 240;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(255, 215, 130, 0.95)";
    ctx.lineWidth = 2.4;
    ctx.fillStyle = "rgba(255, 235, 200, 0.95)";
    ctx.shadowColor = "rgba(255, 210, 120, 0.65)";
    ctx.shadowBlur = 6;

    const lm = landmarks[0] || [];
    if (!lm.length) return;

    const xs = lm.map((p: any) => p.x);
    const ys = lm.map((p: any) => p.y);
    const medianX = xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    const ySorted = ys.slice().sort((a, b) => a - b);
    const y25 = ySorted[Math.floor(ySorted.length * 0.25)] ?? ys[0];
    const y75 = ySorted[Math.floor(ySorted.length * 0.75)] ?? ys[ys.length - 1];

    const topPts = lm.filter((p: any) => p.y <= y25);
    const bottomPts = lm.filter((p: any) => p.y >= y75);

    const averagePoint = (pts: any[]) => {
      if (!pts.length) return null;
      const sx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
      const sy = pts.reduce((sum, p) => sum + p.y, 0) / pts.length;
      return { x: sx, y: sy };
    };

    const leftBrow = averagePoint(topPts.filter((p: any) => p.x < medianX));
    const rightBrow = averagePoint(topPts.filter((p: any) => p.x >= medianX));

    if (leftBrow && rightBrow) {
      ctx.beginPath();
      ctx.moveTo(leftBrow.x * width, leftBrow.y * height);
      ctx.lineTo(rightBrow.x * width, rightBrow.y * height);
      ctx.stroke();
    }

    if (bottomPts.length) {
      const leftMouth = bottomPts.reduce((prev, p) => (p.x < prev.x ? p : prev), bottomPts[0]);
      const rightMouth = bottomPts.reduce((prev, p) => (p.x > prev.x ? p : prev), bottomPts[0]);
      const mouthY = bottomPts.reduce((sum, p) => sum + p.y, 0) / bottomPts.length;
      ctx.beginPath();
      ctx.moveTo(leftMouth.x * width, mouthY * height);
      ctx.lineTo(rightMouth.x * width, mouthY * height);
      ctx.stroke();
      // Corner dots
      ctx.beginPath();
      ctx.arc(leftMouth.x * width, mouthY * height, 3, 0, Math.PI * 2);
      ctx.arc(rightMouth.x * width, mouthY * height, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Head direction cue: center to nose tip (index 1 in MediaPipe landmarks)
    const center = averagePoint(lm);
    const nose = lm[1] || center;
    if (center && nose) {
      ctx.beginPath();
      ctx.moveTo(center.x * width, center.y * height);
      ctx.lineTo(nose.x * width, nose.y * height);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(nose.x * width, nose.y * height, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [showLandmarks, landmarks, videoRef]);
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className={
        isFloating
          ? "relative absolute bottom-2 left-2 z-30 overflow-hidden rounded-xl border-3 shadow-lg md:bottom-4 md:left-4"
          : "relative z-20 overflow-hidden rounded-xl border-3 shadow-lg"
      }
      style={{
        width: isFloating ? "clamp(120px, 15vw, 200px)" : "100%",
        aspectRatio: isFloating ? "4 / 3" : "1 / 1",
        borderColor: "hsl(25, 60%, 40%)",
        backgroundColor: "hsl(25, 20%, 15%)",
        borderWidth: "3px",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
      {showLandmarks && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          style={{ transform: "scaleX(-1)" }}
        />
      )}
      {!cameraOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-center text-xs font-bold text-amber-100">
          Camera off
        </div>
      )}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 py-0.5 text-[8px] font-bold uppercase tracking-wider md:text-[10px]"
        style={{
          background: "hsl(25, 60%, 40%)",
          color: "hsl(40, 90%, 95%)",
        }}
      >
        📷 Your Face {currentEmotion && EMOTION_EMOJI[currentEmotion]}
      </div>
    </motion.div>
  );
}
