import { useEffect, useRef, useState, useCallback } from "react";
import { useGameCanvas } from "../../hooks/use-game-canvas";
import { useCharacter } from "../../hooks/use-character";
import { useItems } from "../../hooks/use-items";
import { useGameLoop } from "../../hooks/use-game-loop";
import { useSprites } from "../../hooks/use-sprites";
import { useKeyboardControls } from "../../hooks/use-keyboard-controls";
import { Renderer } from "../../services/renderer";
import { CollisionDetector } from "../../services/collision-detector";
import { Canvas } from "../../model/canvas";
import { audioManager } from "../../utils/audio.fns";
import "./game-screen.scss";

export const GameScreen: React.FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(audioManager.isMuted());
  const [canvas] = useState<Canvas>({ width: 1600, height: 900 });
  const { sprites, spritesLoaded } = useSprites();
  const {
    character,
    updateCharacter,
    performDash,
    isDashAvailable,
    frameIndex,
    setCharacter,
  } = useCharacter();
  const { items, checkItemCollection } = useItems(
    character,
    setCharacter,
    setScore
  );
  const { mapData, collisionData } = useGameCanvas();
  const renderer = useRef(new Renderer(canvas, mapData)).current;
  const collisionDetector = useRef(
    new CollisionDetector(collisionData)
  ).current;
  const { keysPressed, handleKeyDown, handleKeyUp } = useKeyboardControls(
    character,
    updateCharacter,
    performDash,
    isDashAvailable,
    collisionDetector
  );

  const gameLoop = useCallback(() => {
    if (keysPressed.size === 0) return null;
    updateCharacter(keysPressed, collisionDetector);
    return requestAnimationFrame(gameLoop);
  }, [keysPressed, updateCharacter, collisionDetector]);

  const { startGameLoop, stopGameLoop } = useGameLoop(gameLoop);

  useEffect(() => {
    let animationFrameId: number;
    const renderLoop = () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && spritesLoaded) {
        renderer.render(context, character, items, sprites, frameIndex);
        checkItemCollection();
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    animationFrameId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    character,
    items,
    sprites,
    spritesLoaded,
    renderer,
    frameIndex,
    score,
    checkItemCollection,
  ]);

  useEffect(() => {
    const playGameMusic = () => {
      if (!audioManager.isMuted()) {
        audioManager.play("game");
      }
      window.removeEventListener("click", playGameMusic);
    };
    window.addEventListener("click", playGameMusic);
    return () => {
      window.removeEventListener("click", playGameMusic);
    };
  }, []);

  const toggleMute = useCallback(() => {
    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted());
  }, []);

  return (
    <div className="game_screen_container">
      <div className="game_hud">
        <div className="score">Score: {score}</div>
        <button className="sound_toggle" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      <canvas
        className="game_canvas"
        ref={canvasRef}
        tabIndex={0}
        onKeyDown={(e) => {
          handleKeyDown(e);
          startGameLoop();
        }}
        onKeyUp={(e) => {
          handleKeyUp(e);
          if (keysPressed.size === 0) {
            stopGameLoop();
          }
        }}
        width={canvas.width}
        height={canvas.height}
      ></canvas>
    </div>
  );
};
