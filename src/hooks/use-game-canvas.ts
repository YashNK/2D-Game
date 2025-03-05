import { totalMapHeightPx, totalMapWidthPx } from "../constants";
import { MapData } from "../model/map";
import { useState } from "react";
import Level1 from "../assets/images/2D_Game_Map.png";
import Level1Foreground from "../assets/images/2D_Game_Map_Foreground.png";

export function useGameCanvas() {
  const [mapData, setMapData] = useState<MapData>({
    width: totalMapWidthPx,
    height: totalMapHeightPx,
    currentLevel: Level1,
    currentLevelForeground: Level1Foreground,
  });

  return {
    mapData,
    setMapData,
  };
}
