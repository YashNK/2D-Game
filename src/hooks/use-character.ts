import { useState, useRef, useCallback, useEffect } from "react";
import { CharacterData } from "../model/character";
import {
  characterSpeed,
  characterXPosition,
  characterYPosition,
  dashSpeedMultiplier,
  dashDuration,
  dashCoolDown,
  characterHeight,
  characterWidth,
} from "../constants";
import {
  MainMapCharacterXPosition,
  MainMapCharacterYPosition,
} from "../constants/level1";

export function useCharacter() {
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [isDashAvailable, setIsDashAvailable] = useState<boolean>(true);
  const dashTimeoutRef = useRef<number | null>(null);
  const dashCoolDownRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<string>("down-right");
  const [character, setCharacter] = useState<CharacterData>({
    x: characterXPosition,
    y: characterYPosition,
    speed: characterSpeed,
    mapX: MainMapCharacterXPosition,
    mapY: MainMapCharacterYPosition,
    isWalking: false,
    isDashing: false,
    direction: "down-right",
    width: characterWidth,
    height: characterHeight,
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        setFrameIndex((prev) => {
          if (character.isDashing) {
            return (prev + 1) % 8;
          } else if (character.isWalking) {
            return (prev + 1) % 8;
          } else {
            return (prev + 1) % 6;
          }
        });
      },
      character.isDashing ? 35 : 200
    );
    return () => clearInterval(interval);
  }, [character.isWalking, character.isDashing]);

  useEffect(() => {
    return () => {
      if (dashTimeoutRef.current) {
        clearTimeout(dashTimeoutRef.current);
      }
      if (dashCoolDownRef.current) {
        clearTimeout(dashCoolDownRef.current);
      }
    };
  }, []);

  const getDirection = useCallback(
    (keys: Set<string>) => {
      let newDirection;
      if (keys.has("a") && keys.has("w")) newDirection = "up-left";
      else if (keys.has("d") && keys.has("w")) newDirection = "up-right";
      else if (keys.has("a") && keys.has("s")) newDirection = "down-left";
      else if (keys.has("d") && keys.has("s")) newDirection = "down-right";
      else if (keys.has("a")) newDirection = "down-left";
      else if (keys.has("d")) newDirection = "down-right";
      else if (keys.has("w")) newDirection = "up";
      else if (keys.has("s")) newDirection = "down";
      else return character.direction;
      if (newDirection) {
        lastDirectionRef.current = newDirection;
      }
      return newDirection || character.direction;
    },
    [character.direction]
  );

  useEffect(() => {
    if (character.isWalking || character.isDashing) {
      lastDirectionRef.current = character.direction;
    }
  }, [character.direction, character.isWalking, character.isDashing]);

  const updateCharacter = useCallback(
    (keysPressed: Set<string>, collisionDetector: any) => {
      setCharacter((prev) => {
        let { mapX, mapY, speed, isDashing } = prev;
        let isWalking = false;
        let direction = getDirection(keysPressed);
        const originalX = mapX;
        const originalY = mapY;
        const currentSpeed = isDashing ? speed * dashSpeedMultiplier : speed;
        if (keysPressed.has("a") && keysPressed.has("w")) {
          mapX -= currentSpeed;
          mapY -= currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("d") && keysPressed.has("w")) {
          mapX += currentSpeed;
          mapY -= currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("a") && keysPressed.has("s")) {
          mapX -= currentSpeed;
          mapY += currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("d") && keysPressed.has("s")) {
          mapX += currentSpeed;
          mapY += currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("a")) {
          mapX -= currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("d")) {
          mapX += currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("w")) {
          mapY -= currentSpeed;
          isWalking = true;
        } else if (keysPressed.has("s")) {
          mapY += currentSpeed;
          isWalking = true;
        }
        if (collisionDetector && collisionDetector.hasCollision(mapX, mapY)) {
          mapX = originalX;
          mapY = originalY;
        }
        if (!isWalking && !isDashing) {
          direction = lastDirectionRef.current;
        }
        return {
          ...prev,
          mapX,
          mapY,
          isWalking: isDashing ? false : isWalking,
          direction,
        };
      });
    },
    [getDirection]
  );

  const performDash = useCallback(() => {
    if (!isDashAvailable) return;
    setFrameIndex(0);
    setCharacter((prev) => ({
      ...prev,
      isDashing: true,
      isWalking: false,
    }));
    if (dashTimeoutRef.current) {
      clearTimeout(dashTimeoutRef.current);
    }
    dashTimeoutRef.current = setTimeout(() => {
      setCharacter((prev) => ({
        ...prev,
        isDashing: false,
        isWalking: true,
      }));
      setIsDashAvailable(false);
      if (dashCoolDownRef.current) {
        clearTimeout(dashCoolDownRef.current);
      }
      dashCoolDownRef.current = setTimeout(() => {
        setIsDashAvailable(true);
      }, dashCoolDown);
    }, dashDuration);
  }, [isDashAvailable]);
  return {
    character,
    frameIndex,
    isDashAvailable,
    setIsDashAvailable,
    updateCharacter,
    performDash,
    setCharacter,
  };
}
