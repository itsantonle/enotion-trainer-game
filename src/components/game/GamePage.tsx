import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { IntroScreen } from "./IntroScreen";
import { SplashScreen } from "./SplashScreen";
import { GameplayScreen } from "./GameplayScreen";
import { GameOverScreen } from "./GameOverScreen";
import { VictoryScreen } from "./VictoryScreen";
import { TopNavigation } from "./TopNavigation";

export function GamePage() {
  const gameState = useGameState();
  const { state } = gameState;
  const [cameraOn, setCameraOn] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <div className="relative">
      <TopNavigation
        cameraOn={cameraOn}
        onToggleCamera={() => setCameraOn(v => !v)}
        level={state.currentLevel || 1}
        score={state.score}
        lives={state.lives}
        collapsed={navCollapsed}
        onToggleCollapsed={() => setNavCollapsed(v => !v)}
      />

      {state.phase === "splash" && <SplashScreen onContinue={gameState.beginIntro} />}
      {state.phase === "intro" && <IntroScreen onStart={gameState.startGame} />}

      {state.phase !== "splash" && state.phase !== "intro" && state.phase !== "victory" && (
        <GameplayScreen
          gameState={gameState}
          cameraOn={cameraOn}
          onToggleCamera={() => setCameraOn(v => !v)}
          navCollapsed={navCollapsed}
        />
      )}

      {state.phase === "victory" && (
        <VictoryScreen momMessage={state.momMessage} score={state.score} onRestart={gameState.restartGame} />
      )}

      {/* Game over as overlay modal on top of gameplay */}
      {state.phase === "game_over" && (
        <GameOverScreen
          momMessage={state.momMessage}
          score={state.score}
          level={state.currentLevel}
          onRestart={gameState.restartGame}
        />
      )}
    </div>
  );
}
