import { motion } from "framer-motion";
import { Sparkles, Camera, HandHeart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterLinks } from "./FooterLinks";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,hsla(35,70%,70%,0.25),transparent_28%),radial-gradient(circle_at_80%_10%,hsla(15,70%,65%,0.22),transparent_30%),linear-gradient(180deg,hsl(28,38%,15%)_0%,hsl(24,36%,11%)_100%)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="z-10 w-full max-w-3xl rounded-3xl border-4 border-amber-900/30 bg-[hsl(35,60%,94%)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">Sari-Sari Shift</div>
            <h1 className="text-xl font-bold leading-tight text-amber-950 md:text-2xl">Mom needs a hand today</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-amber-900/10 px-3 py-2 text-xs font-semibold text-amber-900 shadow md:flex">
            <Sparkles className="h-4 w-4" /> Ready?
          </div>
        </div>

        <p className="text-sm leading-relaxed text-amber-900 md:text-base">
          Customers are lining up. Keep your face lit and centered; match their vibe, pick the right prep action, and finish the mini-task fast. Two misses and Mom steps in.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl border border-amber-900/15 bg-white p-4 text-sm text-amber-950 shadow-inner md:grid-cols-3 md:text-base">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" /> Camera on, face centered
          </div>
          <div className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" /> Match the emotion or nod/shake
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" /> Pick the correct action then clear the mini-game
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-wide text-amber-900 md:flex-row md:justify-between">
          <span className="rounded-full bg-amber-900/10 px-3 py-1">Shift starts when you click</span>
          <Button size="lg" onClick={onStart} className="rounded-xl px-6 py-2 text-sm font-bold shadow" style={{ background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))", color: "hsl(40, 90%, 95%)" }}>
            Begin the shift
          </Button>
        </div>
      </motion.div>

      <FooterLinks />
    </div>
  );
}
