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
import { canvasHeight, canvasWidth, mapWidth } from "../../constants";
import { convertTo2DArray } from "../../utils/common.fns";
import { MainMapCollisions } from "../../constants/level1";
import FullScreenIcon from "../../assets/images/full_screen.png";
import "./game-screen.scss";

export const GameScreen: React.FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainer = useRef<HTMLDivElement>(null);
  const { mapData, setMapData } = useGameCanvas();
  const { sprites, spritesLoaded } = useSprites();
  const {
    character,
    updateCharacter,
    performDash,
    isDashAvailable,
    frameIndex,
    setCharacter,
  } = useCharacter();
  const [score, setScore] = useState<number>(0);
  const { items, checkItemCollection, setItemData } = useItems(
    character,
    setCharacter,
    setScore,
    () => fadeToBlackAndChangeLevel
  );
  const collisionDetector = useRef(
    new CollisionDetector(convertTo2DArray(MainMapCollisions, mapWidth))
  ).current;
  const { keysPressed, handleKeyDown, handleKeyUp } = useKeyboardControls(
    character,
    updateCharacter,
    performDash,
    isDashAvailable,
    collisionDetector
  );
  const [isMuted, setIsMuted] = useState<boolean>(audioManager.isMuted());
  const [canvas, setCanvas] = useState<Canvas>({
    width: canvasWidth,
    height: canvasHeight,
  });
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [renderer, setRenderer] = useState(() => new Renderer(canvas, mapData));
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    checkItemCollection,
  ]);

  useEffect(() => {
    canvasRef.current?.focus();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const resizeCanvas = () => {
    if (canvasRef.current) {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setCanvas({ width: newWidth, height: newHeight });
      setMapData((prev) => {
        const updatedMapData = {
          ...prev,
          currentLevel: prev.currentLevel,
          currentLevelForeground: prev.currentLevelForeground,
        };
        setRenderer(
          new Renderer({ width: newWidth, height: newHeight }, updatedMapData)
        );
        return updatedMapData;
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && gameContainer.current) {
      gameContainer.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        resizeCanvas();
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        resizeCanvas();
      });
    }
  };

  const fadeToBlackAndChangeLevel = (
    newLevel: string,
    newLevelForeground: string | null,
    newLevelCollision: number[][],
    newMapItems: number[],
    characterXPosition: number,
    characterYPosition: number
  ) => {
    setFadeOpacity(0);
    setTimeout(() => {
      setMapData((prev) => ({
        ...prev,
        currentLevel: newLevel,
        currentLevelForeground: newLevelForeground,
      }));
      setCharacter((prev) => ({
        ...prev,
        mapX: characterXPosition,
        mapY: characterYPosition,
      }));
      setRenderer(
        new Renderer(canvas, {
          ...mapData,
          currentLevel: newLevel,
          currentLevelForeground: newLevelForeground
            ? newLevelForeground
            : null,
        })
      );
      collisionDetector.setCollisionData(newLevelCollision);
      setItemData(convertTo2DArray(newMapItems, mapWidth));
      setTimeout(() => {
        setFadeOpacity(1);
      }, 500);
    }, 500);
  };

  const toggleMute = useCallback(() => {
    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted());
  }, []);

  return (
    <div ref={gameContainer} className="game_screen_container">
      <div style={{ maxHeight: canvas.height }} className="game_hud">
        <img
          className="full_screen_icon"
          onClick={toggleFullscreen}
          src={FullScreenIcon}
        />
        <div className="score">Score: {score}</div>
        <span className="sound_toggle" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </span>
        <div className={`dash_hud ${isDashAvailable ? "hidden" : ""}`}>
          Dash Blocked
        </div>
        <canvas
          className={`game_canvas ${fadeOpacity === 0 ? "opacity_0" : ""}`}
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
    </div>
  );
};
