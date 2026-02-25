import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Store, Clock, ImageIcon } from "lucide-react";
import { FooterLinks } from "./FooterLinks";
import gsap from "gsap";

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      { y: 32, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    ).fromTo(
      glowRef.current,
      { opacity: 0 },
      { opacity: 0.5, duration: 0.6, ease: "power1.out" },
      "<"
    );
    return () => tl.kill();
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_22%_30%,hsla(30,70%,55%,0.32),transparent_26%),radial-gradient(circle_at_78%_15%,hsla(15,70%,55%,0.26),transparent_28%),linear-gradient(180deg,hsl(25,32%,10%)_0%,hsl(22,30%,9%)_100%)] px-4 py-12">
      <div ref={glowRef} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsla(40,80%,70%,0.12),transparent_38%),radial-gradient(circle_at_40%_70%,hsla(20,80%,60%,0.1),transparent_40%)]" />
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-3xl rounded-3xl border-4 border-amber-900/35 bg-[hsl(35,62%,96%)] p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-8"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800 shadow">
          <Clock className="h-4 w-4" /> Loading your shift
        </div>
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-200/90 text-2xl shadow-inner">
          <Store className="h-9 w-9 text-amber-900" />
        </div>
        <h1 className="text-xl font-bold text-amber-950 md:text-2xl">Mom asked you to help the store today.</h1>
        <p className="mt-2 text-sm text-amber-900 md:text-base">
          Customers are already queuing outside. Keep your camera on, stay calm, and match their mood before the line gets restless.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-amber-900">
          <span className="rounded-full bg-amber-200/80 px-3 py-1">Camera ready</span>
          <span className="rounded-full bg-amber-200/80 px-3 py-1">2 lives</span>
          <span className="rounded-full bg-amber-200/80 px-3 py-1">Mini-games incoming</span>
        </div>
        <Button
          size="lg"
          onClick={onContinue}
          className="mt-5 rounded-xl px-6 py-2 text-sm font-bold shadow-lg"
          style={{ background: "linear-gradient(135deg, hsl(25, 80%, 52%), hsl(15, 85%, 48%))", color: "hsl(40, 100%, 96%)" }}
        >
          Continue
        </Button>
      </motion.div>
      <FooterLinks />
    </div>
  );
}
