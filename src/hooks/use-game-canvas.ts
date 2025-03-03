import { convertTo2DArray } from "../utils/common.fns";
import { RawCollisionData } from "../constants/collisions";
import { mapWidth, totalMapHeightPx, totalMapWidthPx } from "../constants";
import { CollisionMap, MapData } from "../model/map";
import Level1 from "../assets/images/2D_Game_Map.png";
import Level1Foreground from "../assets/images/2D_Game_Map_Foreground.png";

export function useGameCanvas() {
  const collisionData: CollisionMap = convertTo2DArray(
    RawCollisionData,
    mapWidth
  );

  const mapData: MapData = {
    width: totalMapWidthPx,
    height: totalMapHeightPx,
    currentLevel: Level1,
    currentLevelForeground: Level1Foreground,
  };

  return { mapData, collisionData };
}
