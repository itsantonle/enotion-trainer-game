import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { ActionPanel } from "./ActionPanel";
import { CustomerSprite } from "./CustomerSprite";
import { DialogBox } from "./DialogBox";
import { EmotionIndicator } from "./EmotionIndicator";
import { HeadGesturePanel } from "./HeadGesturePanel";
import { HUD } from "./HUD";
import { MomDialog } from "./MomDialog";
import { WebcamFeed } from "./WebcamFeed";
import { FooterLinks } from "./FooterLinks";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const QUICK_STEPS = [
  { title: "Frame", desc: "Center your face; keep shoulders visible." },
  { title: "Steady", desc: "Hold the requested emotion for a beat." },
  { title: "Head cues", desc: "Nod for yes, shake for no when prompted." },
  { title: "Action", desc: "Pick the prep move, then clear the mini challenge." },
];

const QUICK_FACES = [
  { label: "Happy", hint: "Soft smile, lifted cheeks." },
  { label: "Sad", hint: "Lowered mouth corners." },
  { label: "Angry", hint: "Brows down, tight jaw." },
  { label: "Surprised", hint: "Wide eyes, open jaw." },
  { label: "Neutral", hint: "Relaxed face, breathe." },
];

interface GameplayScreenProps {
  gameState: ReturnType<typeof useGameState>;
  cameraOn: boolean;
  onToggleCamera: () => void;
  navCollapsed?: boolean;
}

export function GameplayScreen({ gameState, cameraOn, onToggleCamera, navCollapsed = false }: GameplayScreenProps) {
  const {
    state,
    startSequence,
    advanceLine,
    completeFaceCheck,
    completeAction,
    handleWrongAction,
    completeWrongActionPenalty,
    completeHeadGesture,
    setFaceWarning,
    nextLevel,
    updateFaceProgress,
  } = gameState;

  const {
    videoRef,
    currentEmotion,
    lastHeadGesture,
    clearHeadGesture,
    initFaceLandmarker,
    startWebcam,
    startDetection,
    stopDetection,
    stopWebcam,
    isCameraOn,
    isModelReady,
    lastLandmarks,
  } = useFaceDetection();

  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    initFaceLandmarker();
  }, [initFaceLandmarker]);

  useEffect(() => {
    if (cameraOn) {
      startWebcam();
    } else {
      stopDetection();
      stopWebcam();
    }
  }, [cameraOn, startWebcam, stopDetection, stopWebcam]);

  useEffect(() => {
    if (cameraOn && isModelReady && isCameraOn) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [cameraOn, isModelReady, isCameraOn, startDetection, stopDetection]);

  useEffect(() => {
    if (state.phase !== "face_check" && state.phase !== "wrong_action_penalty") {
      progressRef.current = 0;
      updateFaceProgress(0);
      setFaceWarning(false, 0);
      return;
    }

    progressRef.current = 0;
    updateFaceProgress(0);
    const requiredEmotion = state.faceCheckRequired || "neutral";
    const durationSeconds = state.faceCheckDuration || 2.5;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      const isMatch = requiredEmotion === "neutral" ? currentEmotion === "neutral" : currentEmotion === requiredEmotion;
      const decay = delta * 0.6;

      if (isMatch) {
        progressRef.current = Math.min(1, progressRef.current + delta / durationSeconds);
      } else {
        progressRef.current = Math.max(0, progressRef.current - decay);
      }

      updateFaceProgress(progressRef.current);
      setFaceWarning(!isMatch && progressRef.current < 0.35, Math.max(0, Math.ceil((1 - progressRef.current) * durationSeconds)));

      if (progressRef.current >= 1) {
        if (state.phase === "wrong_action_penalty") {
          completeWrongActionPenalty();
        } else {
          completeFaceCheck();
        }
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      progressRef.current = 0;
      updateFaceProgress(0);
      setFaceWarning(false, 0);
    };
  }, [state.phase, state.faceCheckRequired, state.faceCheckDuration, currentEmotion, updateFaceProgress, setFaceWarning, completeFaceCheck, completeWrongActionPenalty]);

  useEffect(() => {
    if (state.phase === "head_gesture" && state.headGestureRequired && lastHeadGesture === state.headGestureRequired) {
      const timer = setTimeout(() => {
        completeHeadGesture();
        clearHeadGesture();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.headGestureRequired, lastHeadGesture, completeHeadGesture, clearHeadGesture]);

  useEffect(() => {
    if (state.phase === "sequence_end") {
      advanceLine();
    }
  }, [state.phase, advanceLine]);

  useEffect(() => {
    if (state.phase === "game_over") {
      stopDetection();
    }
  }, [state.phase, stopDetection]);

  const topPad = navCollapsed ? 64 : 92;

  return (
    <div className="relative min-h-screen w-screen overflow-hidden" style={{ background: "radial-gradient(circle at 20% 20%, hsla(40, 50%, 18%, 0.6), transparent 25%), hsl(30, 35%, 20%)", paddingTop: `${topPad}px` }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70" style={{ backgroundImage: "url(/backgrounds/store-counter.png)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(20, 45%, 10%, 0.65) 0%, hsla(28, 40%, 14%, 0.75) 40%, hsla(28, 55%, 18%, 0.8) 100%)" }} />

      <HUD level={state.currentLevel} lives={state.lives} score={state.score} customerName={state.customer?.name} offsetTop={16} showScore={false} />

      {state.showMom && (
        <div className="pointer-events-none fixed left-1/2 top-16 z-40 w-[min(520px,90vw)] -translate-x-1/2 px-3">
          <MomDialog message={state.momMessage} isVisible={true} />
        </div>
      )}

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col gap-4 px-3 pb-8 md:px-6 lg:px-8 lg:pb-10">
        <div className="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-3xl border-4 p-4 shadow-2xl md:p-6" style={{ borderColor: "hsla(30, 65%, 45%, 0.8)", background: "radial-gradient(circle at 20% 30%, hsla(40, 45%, 20%, 0.7), transparent 35%), hsla(25, 25%, 12%, 0.92)" }}>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-8 h-2 bg-[hsl(28,35%,18%)] shadow-inner" />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-amber-100/85 shadow-lg md:text-xs">
              <span>Queue #{state.currentLevel || 1}</span>
              <span className="rounded-full bg-amber-500/30 px-2 py-1 text-amber-50">{state.customer?.description || "Express Lane"}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-100/80 md:text-xs">
              <span className="rounded-full bg-amber-500/25 px-3 py-1">Phase · {state.phase.replace("_", " ")}</span>
              <span className="rounded-full bg-black/35 px-3 py-1">{state.customer?.name || "New Face"}</span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-center md:gap-6">
            <div className="flex flex-1 justify-center md:justify-end">
              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border-3 border-amber-900/40 bg-amber-950/35 shadow-inner">
                <AnimatePresence>
                  {state.customer && (
                    <CustomerSprite
                      customer={state.customer}
                      isTalking={state.phase === "dialog" && state.currentLine?.speaker === "customer"}
                      className="absolute inset-0"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex w-full max-w-xl flex-1 flex-col gap-3 rounded-2xl border-3 border-amber-700/40 bg-black/45 p-3 text-amber-50 shadow-xl backdrop-blur">
              {state.phase === "sequence_intro" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 text-center">
                  <div className="text-sm font-bold uppercase tracking-wider text-amber-200">Shift briefing</div>
                  <div className="rounded-xl border-2 border-amber-600/50 bg-amber-50/90 px-3 py-2 text-sm font-semibold text-amber-900 shadow-lg">
                    {state.levelData?.description || "Serve the next customer with the right vibe."}
                  </div>
                  <Button onClick={startSequence} className="mx-auto rounded-xl px-5 py-2 text-sm font-bold shadow-lg md:px-6 md:py-3 md:text-base" style={{ background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))", color: "hsl(40, 90%, 95%)" }}>
                    Ready! 💪
                  </Button>
                </motion.div>
              )}

              {state.phase === "dialog" && state.currentLine && (
                <DialogBox line={state.currentLine} customerName={state.customer?.name} onAdvance={advanceLine} showContinue={true} />
              )}

              {state.phase === "face_check" && state.currentLine && (
                <div className="relative flex w-full flex-col gap-2">
                  {!cameraOn && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-red-400/70 bg-red-900/80 p-3 text-center text-sm font-bold text-red-50 shadow-lg">
                      Camera is off — flip it back on to let us read your face.
                      <Button size="sm" onClick={onToggleCamera} className="mt-2 rounded-lg px-3 py-2 text-xs font-bold" style={{ background: "linear-gradient(135deg, hsl(145, 60%, 42%), hsl(145, 65%, 35%))", color: "white" }}>
                        Turn camera on
                      </Button>
                    </div>
                  )}
                  <DialogBox line={state.currentLine} customerName={state.customer?.name} />
                  <EmotionIndicator requiredEmotion={state.faceCheckRequired!} currentEmotion={currentEmotion} progress={state.faceCheckProgress} duration={state.faceCheckDuration} warning={state.faceCheckWarning} warningCountdown={state.faceCheckWarningCountdown} />
                </div>
              )}

              {state.phase === "wrong_action_penalty" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-xl border-2 border-amber-600/60 bg-amber-50/95 px-3 py-2 text-center shadow-lg">
                    <p className="text-sm font-bold text-amber-900">Wrong action! Make a sad face as penalty 😢</p>
                  </div>
                  <EmotionIndicator requiredEmotion="sad" currentEmotion={currentEmotion} progress={state.faceCheckProgress} duration={state.faceCheckDuration} warning={state.faceCheckWarning} warningCountdown={state.faceCheckWarningCountdown} />
                </div>
              )}

              {state.phase === "head_gesture" && state.currentLine && (
                <div className="flex flex-col items-center gap-2">
                  <DialogBox line={state.currentLine} customerName={state.customer?.name} />
                  <HeadGesturePanel required={state.headGestureRequired!} detected={lastHeadGesture} onComplete={completeHeadGesture} onClearGesture={clearHeadGesture} />
                </div>
              )}

              {state.phase === "action" && state.currentLine && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="rounded-xl border border-amber-600/50 bg-black/30 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-amber-100">Action phase</div>
                  <DialogBox line={state.currentLine} customerName={state.customer?.name} />
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">Look at the overlay to pick the move</div>
                </div>
              )}

              {state.phase === "level_complete" && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
                  <div className="rounded-2xl border-3 p-4 text-center shadow-lg" style={{ background: "hsl(120, 40%, 92%)", borderColor: "hsl(120, 40%, 60%)", borderWidth: "3px" }}>
                    <div className="text-3xl md:text-4xl">🎉</div>
                    <p className="mt-1 text-sm font-bold md:mt-2 md:text-lg" style={{ color: "hsl(120, 40%, 30%)" }}>Level {state.currentLevel} Complete!</p>
                    <p className="text-xs md:text-sm" style={{ color: "hsl(120, 30%, 40%)" }}>Customer served!</p>
                  </div>
                  <Button onClick={nextLevel} className="rounded-xl px-5 py-2 text-sm font-bold shadow-lg md:px-6 md:py-3 md:text-lg" style={{ background: "linear-gradient(135deg, hsl(25, 70%, 50%), hsl(15, 80%, 45%))", color: "hsl(40, 90%, 95%)" }}>
                    Next Customer →
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="flex flex-1 justify-center md:justify-start">
              <div className="relative aspect-square w-full max-w-[320px] rounded-[28px] border-4 border-amber-800/60 bg-gradient-to-b from-zinc-900 to-zinc-800 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-amber-200/60" />
                <div className="absolute left-4 top-3 h-1 w-6 rounded-full bg-amber-300/60" />
                <WebcamFeed
                  videoRef={videoRef}
                  currentEmotion={currentEmotion}
                  cameraOn={cameraOn}
                  variant="docked"
                  showLandmarks={showLandmarks}
                  landmarks={showLandmarks ? lastLandmarks : null}
                />
                <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                  <span className="rounded-full bg-black/40 px-2 py-1">Camera Deck</span>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setShowTipsModal(true)} className="h-7 w-7 rounded-full text-[11px] font-bold text-amber-100" style={{ background: "hsla(45, 70%, 40%, 0.35)" }}>
                      ?
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setShowLandmarks(v => !v)} className="h-7 w-7 rounded-full text-[10px] font-bold text-amber-100" style={{ background: showLandmarks ? "hsla(45, 70%, 45%, 0.5)" : "hsla(25, 30%, 25%, 0.6)" }}>
                      Mesh
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onToggleCamera} className="h-7 rounded-lg px-2 text-[11px] font-bold text-amber-100" style={{ background: cameraOn ? "hsla(145, 60%, 35%, 0.35)" : "hsla(0, 65%, 40%, 0.5)" }}>
                      {cameraOn ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {state.phase === "action" && state.currentLine && (
            <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/75 px-3 md:px-6">
              <div className="max-h-[88vh] w-full max-w-[min(900px,92vw)] overflow-y-auto rounded-3xl border-4 border-amber-400/80 bg-[hsl(42,90%,96%)] p-4 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:p-6">
                <div className="mb-2 text-[12px] font-black uppercase tracking-widest text-amber-900">Action phase</div>
                <p className="mb-4 text-base font-semibold text-amber-950 md:text-lg">{state.currentLine.text}</p>
                <ActionPanel
                  correctAction={state.correctAction!}
                  choices={state.actionChoices}
                  onCorrect={completeAction}
                  onWrong={handleWrongAction}
                  useMinigames
                />
                <div className="mt-2 text-[11px] text-amber-800">Choose the correct prep, then finish the mini task.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="max-w-lg bg-amber-50">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Shift tips</DialogTitle>
            <DialogDescription className="text-amber-800">Quick reminders to keep the run smooth.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_STEPS.map(step => (
                <div key={step.title} className="rounded-xl border-2 border-amber-500/30 bg-white px-3 py-2 text-[11px] text-amber-800">
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-[10px] text-amber-700">{step.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-amber-800">
              {QUICK_FACES.map(faceHint => (
                <span key={faceHint.label} className="rounded-full border border-amber-500/40 bg-white px-3 py-1">
                  {faceHint.label}: <span className="text-amber-700">{faceHint.hint}</span>
                </span>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FooterLinks />
    </div>
  );
}
