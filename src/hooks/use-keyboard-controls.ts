import { useRef, useCallback } from "react";
import { CharacterData } from "../model/character";

export function useKeyboardControls(
  character: CharacterData,
  updateCharacter: (keysPressed: Set<string>, collisionDetector: any) => void,
  performDash: () => void,
  isDashAvailable: boolean,
  collisionDetector: any
) {
  const keysPressed = useRef(new Set<string>());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (e.code === "Space" && !character.isDashing && isDashAvailable) {
        performDash();
      }
      keysPressed.current.add(e.key);
    },
    [character.isDashing, isDashAvailable, performDash]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      keysPressed.current.delete(e.key);
      if (keysPressed.current.size === 0) {
        updateCharacter(new Set<string>(), collisionDetector);
      }
    },
    [updateCharacter, collisionDetector]
  );

  return {
    keysPressed: keysPressed.current,
    handleKeyDown,
    handleKeyUp,
  };
}
