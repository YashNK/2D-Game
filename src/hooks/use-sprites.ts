import { useState, useEffect } from "react";
import {
  getIdleSprite,
  getRunningSprite,
  getDashingSprite,
} from "../utils/sprite.fns";

export function useSprites() {
  const [sprites, setSprites] = useState<Record<string, HTMLImageElement>>({});
  const [spritesLoaded, setSpritesLoaded] = useState<boolean>(false);
  const loadedSprites: Record<string, HTMLImageElement> = {};

  useEffect(() => {
    const directions = [
      "down",
      "up",
      "down-left",
      "down-right",
      "up-left",
      "up-right",
    ];
    let loadedCount: number = 0;
    const totalSprites: number = directions.length * 3;
    directions.forEach((dir) => {
      const idleImg = new Image();
      idleImg.src = getIdleSprite(dir);
      idleImg.onload = () => {
        loadedCount++;
        if (loadedCount === totalSprites) {
          setSpritesLoaded(true);
        }
      };
      loadedSprites[`idle-${dir}`] = idleImg;
      const runningImg = new Image();
      runningImg.src = getRunningSprite(dir);
      runningImg.onload = () => {
        loadedCount++;
        if (loadedCount === totalSprites) {
          setSpritesLoaded(true);
        }
      };
      loadedSprites[`running-${dir}`] = runningImg;
      const dashingImg = new Image();
      dashingImg.src = getDashingSprite(dir);
      dashingImg.onload = () => {
        loadedCount++;
        if (loadedCount === totalSprites) {
          setSpritesLoaded(true);
        }
      };
      loadedSprites[`dashing-${dir}`] = dashingImg;
    });
    setSprites(loadedSprites);
  }, []);

  return { sprites, spritesLoaded };
}
