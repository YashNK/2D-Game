import { useRef, useCallback } from "react";

export function useGameLoop(gameLoop: () => number | null) {
  const requestRef = useRef<number | null>(null);

  const startGameLoop = useCallback(() => {
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const stopGameLoop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  return { startGameLoop, stopGameLoop };
}
