import { useState, useCallback, useRef } from "react";
import {
  CUSTOMERS,
  LEVELS,
  MOM_REACTIONS,
  getSequencesForLevel,
  getCustomerForLevel,
  pickRandom,
  type Emotion,
  type HeadGesture,
  type ConversationSequence,
  type DialogLine,
  type CustomerData,
  type LevelData,
  type ActionType,
} from "@/data/gameData";

export type GamePhase =
  | "intro"
  | "tutorial"
  | "playing"
  | "sequence_intro"
  | "dialog"
  | "face_check"
  | "action"
  | "head_gesture"
  | "wrong_action_penalty"
  | "sequence_end"
  | "level_complete"
  | "game_over"
  | "victory";

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  lives: number;
  customer: CustomerData | null;
  levelData: LevelData | null;
  sequences: ConversationSequence[];
  currentSequenceIndex: number;
  currentLineIndex: number;
  currentLine: DialogLine | null;
  momMessage: string;
  showMom: boolean;
  faceCheckProgress: number;
  faceCheckRequired: Emotion | null;
  faceCheckDuration: number;
  faceCheckWarning: boolean;
  faceCheckWarningCountdown: number;
  headGestureRequired: HeadGesture | null;
  score: number;
  usedCustomerIds: string[];
  /** For action phase: shuffled list of action buttons (correct + wrong) */
  actionChoices: ActionType[];
  correctAction: ActionType | null;
}

const INITIAL_STATE: GameState = {
  phase: "splash",
  currentLevel: 0,
  lives: 2,
  customer: null,
  levelData: null,
  sequences: [],
  currentSequenceIndex: 0,
  currentLineIndex: 0,
  currentLine: null,
  momMessage: "",
  showMom: false,
  faceCheckProgress: 0,
  faceCheckRequired: null,
  faceCheckDuration: 0,
  faceCheckWarning: false,
  faceCheckWarningCountdown: 0,
  headGestureRequired: null,
  score: 0,
  usedCustomerIds: [],
  actionChoices: [],
  correctAction: null,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginIntro = useCallback(() => {
    setState(s => ({ ...s, phase: "intro", lives: 2, currentLevel: 0, score: 0, usedCustomerIds: [] }));
  }, []);

  const startGame = useCallback(() => {
    const levelData = LEVELS[0];
    const customer = getCustomerForLevel(1, []);
    const sequences = getSequencesForLevel(levelData, customer);

    setState(s => ({
      ...s,
      phase: "sequence_intro",
      currentLevel: 1,
      levelData,
      customer,
      sequences,
      currentSequenceIndex: 0,
      currentLineIndex: 0,
      currentLine: null,
      momMessage: pickRandom(customer.greetings),
      showMom: false,
      usedCustomerIds: [customer.id],
    }));
  }, []);

  const skipTutorial = startGame;

  const buildActionChoices = (line: DialogLine): ActionType[] => {
    if (!line.action) return [];
    const wrong = line.wrongActions || [];
    const all = [line.action, ...wrong];
    return all.sort(() => Math.random() - 0.5);
  };

  const getPhaseForLine = (line: DialogLine): GamePhase => {
    if (line.requiredEmotion) return "face_check";
    if (line.headGesture) return "head_gesture";
    if (line.action) return "action";
    return "dialog";
  };

  const startSequence = useCallback(() => {
    setState(s => {
      const seq = s.sequences[s.currentSequenceIndex];
      if (!seq) return s;
      const line = seq.lines[0];
      return {
        ...s,
        phase: getPhaseForLine(line),
        currentLineIndex: 0,
        currentLine: line,
        faceCheckProgress: 0,
        faceCheckRequired: line.requiredEmotion || null,
        faceCheckDuration: (line.holdDuration || 3) * (s.levelData?.holdDurationMultiplier || 1),
        faceCheckWarning: false,
        faceCheckWarningCountdown: 0,
        headGestureRequired: line.headGesture || null,
        showMom: false,
        actionChoices: buildActionChoices(line),
        correctAction: line.action || null,
      };
    });
  }, []);

  const advanceLine = useCallback(() => {
    setState(s => {
      const seq = s.sequences[s.currentSequenceIndex];
      if (!seq) return s;

      const nextIndex = s.currentLineIndex + 1;
      if (nextIndex >= seq.lines.length) {
        const nextSeqIndex = s.currentSequenceIndex + 1;
        if (nextSeqIndex >= s.sequences.length) {
          return {
            ...s,
            phase: "level_complete" as GamePhase,
            showMom: true,
            momMessage: pickRandom(MOM_REACTIONS.success),
            score: s.score + s.currentLevel * 100,
          };
        }
        return {
          ...s,
          phase: "sequence_intro" as GamePhase,
          currentSequenceIndex: nextSeqIndex,
          currentLineIndex: 0,
          currentLine: null,
          showMom: true,
          momMessage: pickRandom(MOM_REACTIONS.success),
        };
      }

      const line = seq.lines[nextIndex];
      return {
        ...s,
        phase: getPhaseForLine(line),
        currentLineIndex: nextIndex,
        currentLine: line,
        faceCheckProgress: 0,
        faceCheckRequired: line.requiredEmotion || null,
        faceCheckDuration: (line.holdDuration || 3) * (s.levelData?.holdDurationMultiplier || 1),
        faceCheckWarning: false,
        faceCheckWarningCountdown: 0,
        headGestureRequired: line.headGesture || null,
        showMom: false,
        actionChoices: buildActionChoices(line),
        correctAction: line.action || null,
      };
    });
  }, []);

  const setFaceWarning = useCallback((warning: boolean, countdown: number) => {
    setState(s => ({ ...s, faceCheckWarning: warning, faceCheckWarningCountdown: countdown }));
  }, []);

  const failFaceCheck = useCallback(() => {
    setState(s => {
      const newLives = s.lives - 1;
      if (newLives <= 0) {
        return {
          ...s,
          lives: 0,
          phase: "game_over" as GamePhase,
          showMom: true,
          momMessage: pickRandom(MOM_REACTIONS.gameOver),
        };
      }
      return {
        ...s,
        lives: newLives,
        showMom: true,
        momMessage: pickRandom(MOM_REACTIONS.fail),
      };
    });

    setTimeout(() => {
      setState(s => {
        if (s.phase === "game_over") return s;
        return { ...s, showMom: false };
      });
      advanceLine();
    }, 2000);
  }, [advanceLine]);

  const completeFaceCheck = useCallback(() => {
    advanceLine();
  }, [advanceLine]);

  const completeAction = useCallback(() => {
    advanceLine();
  }, [advanceLine]);

  const handleWrongAction = useCallback(() => {
    // Wrong action: force sad face penalty
    setState(s => {
      const newLives = s.lives - 1;
      if (newLives <= 0) {
        return {
          ...s,
          lives: 0,
          phase: "game_over" as GamePhase,
          showMom: true,
          momMessage: pickRandom(MOM_REACTIONS.gameOver),
        };
      }
      return {
        ...s,
        lives: newLives,
        phase: "wrong_action_penalty" as GamePhase,
        showMom: true,
        momMessage: pickRandom(MOM_REACTIONS.wrongAction),
        faceCheckRequired: "sad",
        faceCheckProgress: 0,
        faceCheckDuration: 2,
        faceCheckWarning: false,
      };
    });
  }, []);

  const completeWrongActionPenalty = useCallback(() => {
    setState(s => ({ ...s, showMom: false }));
    advanceLine();
  }, [advanceLine]);

  const completeHeadGesture = useCallback(() => {
    advanceLine();
  }, [advanceLine]);

  const nextLevel = useCallback(() => {
    setState(s => {
      const nextLevelNum = s.currentLevel + 1;
      if (nextLevelNum > LEVELS.length) {
        return {
          ...s,
          phase: "victory" as GamePhase,
          showMom: true,
          momMessage: pickRandom(MOM_REACTIONS.victory),
        };
      }

      const levelData = LEVELS[nextLevelNum - 1];
      const customer = getCustomerForLevel(nextLevelNum, s.usedCustomerIds);
      const sequences = getSequencesForLevel(levelData, customer);

      return {
        ...s,
        phase: "sequence_intro" as GamePhase,
        currentLevel: nextLevelNum,
        levelData,
        customer,
        sequences,
        currentSequenceIndex: 0,
        currentLineIndex: 0,
        currentLine: null,
        showMom: false,
        usedCustomerIds: [...s.usedCustomerIds, customer.id],
      };
    });
  }, []);

  const updateFaceProgress = useCallback((progress: number) => {
    setState(s => ({ ...s, faceCheckProgress: progress }));
  }, []);

  const restartGame = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    state,
    beginIntro,
    startGame,
    skipTutorial,
    startSequence,
    advanceLine,
    failFaceCheck,
    completeFaceCheck,
    completeAction,
    handleWrongAction,
    completeWrongActionPenalty,
    completeHeadGesture,
    setFaceWarning,
    nextLevel,
    updateFaceProgress,
    restartGame,
  };
}
