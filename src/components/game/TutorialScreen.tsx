import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Angry, Meh, Eye, Hand, ArrowDown, ArrowLeftRight, MousePointerClick } from "lucide-react";

interface TutorialScreenProps {
  onSkip: () => void;
}

const emotions = [
  { name: "Happy 😊", icon: Smile, desc: "Smile wide! Raise those cheeks!", color: "hsl(45, 80%, 50%)" },
  { name: "Sad 😢", icon: Frown, desc: "Frown and look down slightly.", color: "hsl(220, 60%, 55%)" },
  { name: "Angry 😠", icon: Angry, desc: "Furrow your brows and clench jaw.", color: "hsl(0, 70%, 50%)" },
  { name: "Surprised 😲", icon: Eye, desc: "Open eyes wide and raise eyebrows!", color: "hsl(280, 60%, 55%)" },
  { name: "Neutral 😐", icon: Meh, desc: "Relax your face completely.", color: "hsl(160, 40%, 45%)" },
];

const steps = [
  {
    emoji: "👤",
    title: "1. Customers Will Approach",
    desc: "Different customers come to the store. Some are friendly, some are demanding. Read their dialog carefully!",
  },
  {
    emoji: "😊",
    title: "2. Make the Right Face",
    desc: "When prompted, make the correct facial expression and HOLD it for the required time. Your webcam detects your face in real-time!",
  },
  {
    emoji: "⚠️",
    title: "3. Watch the Timer!",
    desc: "If you stop making the correct face, you'll get a warning countdown. Fix your expression quickly or you'll lose a life!",
  },
  {
    emoji: "🖱️",
    title: "4. Click the Right Action",
    desc: "When serving items, you'll see multiple action buttons (Take, Chop, Pack, etc.). Click the CORRECT one! Wrong clicks lose a life and you must make a sad face as penalty.",
  },
  {
    emoji: "😢→😊",
    title: "5. Multiple Faces Per Conversation",
    desc: "Complex customers may require you to switch between different expressions during one conversation. Stay alert!",
  },
  {
    emoji: "🔄",
    title: "6. Nod & Shake",
    desc: "Some questions need a YES (nod your head up and down) or NO (shake your head side to side) — the camera tracks your head movement!",
  },
  {
    emoji: "❤️❤️",
    title: "7. You Have 2 Lives",
    desc: "Fail a face check OR click a wrong action and you lose a life. Lose both and mama sends you away! Reload the page to try again from the start.",
  },
];

export function TutorialScreen({ onSkip }: TutorialScreenProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at 20% 20%, hsla(30, 70%, 60%, 0.35), transparent 32%), linear-gradient(180deg, hsl(28, 45%, 18%) 0%, hsl(25, 40%, 14%) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl rounded-3xl border-4 border-amber-800/30 bg-amber-50/90 p-5 shadow-2xl backdrop-blur-sm md:p-7"
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-center text-xl font-bold md:text-2xl" style={{ color: "hsl(25, 60%, 30%)" }}>
            📖 Arcade Manual — Sari-Sari Shift
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-amber-900">
            <span className="rounded-full bg-amber-200/80 px-3 py-1">Best emotion: Happy 😊</span>
            <span className="rounded-full bg-amber-200/70 px-3 py-1">Nod = Yes · Shake = No</span>
            <span className="rounded-full bg-amber-200/70 px-3 py-1">2 lives · stay calm</span>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border-2 p-3 shadow-sm"
              style={{ borderColor: "hsl(25, 40%, 75%)", background: "hsl(40, 50%, 96%)" }}
            >
              <div className="mb-1 text-lg">{step.emoji}</div>
              <h4 className="text-xs font-bold md:text-sm" style={{ color: "hsl(25, 60%, 30%)" }}>
                {step.title}
              </h4>
              <p className="text-[11px] leading-tight md:text-xs" style={{ color: "hsl(25, 35%, 40%)" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Emotions */}
        <h3 className="mb-2 text-center text-sm font-semibold md:text-base" style={{ color: "hsl(25, 55%, 35%)" }}>
          Faces You'll Need to Make
        </h3>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {emotions.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 shadow-sm"
              style={{ border: `1px solid ${e.color}55`, backgroundColor: e.color + "15" }}
            >
              <e.icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: e.color }} />
              <div className="leading-tight">
                <span className="text-[11px] font-semibold" style={{ color: e.color }}>{e.name}</span>
                <div className="text-[10px] opacity-75">{e.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onSkip}
            className="rounded-xl border-2 border-amber-900/20 px-6 py-3 text-base font-bold shadow-lg transition-all hover:scale-105 md:px-8 md:py-4 md:text-lg"
            style={{
              background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))",
              color: "hsl(40, 90%, 95%)",
            }}
          >
            Sige, gets ko na! (I understand!) 💪
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
