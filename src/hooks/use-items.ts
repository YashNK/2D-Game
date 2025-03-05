import { useState, useCallback, useEffect, useRef } from "react";
import { convertTo2DArray } from "../utils/common.fns";
import {
  mapWidth,
  baseTileSize,
  zoomFactor,
  Item1,
  AudioSounds,
  SuperItem,
  Door,
  DoorToMainMap,
  CoinInsideHouse,
  superJoeSpeed,
  superJoeWidth,
  superJoeHeight,
  characterSpeed,
  characterWidth,
  characterHeight,
} from "../constants";
import { audioManager } from "../utils/audio.fns";
import { Item, ItemsMap } from "../model/item/item";
import { CharacterData } from "../model/character";
import {
  MainMapCharacterXPosition,
  MainMapCharacterYPosition,
  MainMapCollectables,
  MainMapCollisions,
} from "../constants/level1";
import {
  House1CharacterXPosition,
  House1CharacterYPosition,
  House1Collectables,
  House1Collisions,
} from "../constants/level2";
import MainMap from "../assets/images/2D_Game_Map.png";
import MainMapForeGround from "../assets/images/2D_Game_Map_Foreground.png";
import House from "../assets/images/House_Interior.png";

export function useItems(
  character: CharacterData,
  setCharacter: React.Dispatch<React.SetStateAction<CharacterData>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  getLevelTransitionFunction?: () => (
    newLevel: string,
    newLevelForeground: string | null,
    newCollision: number[][],
    newMapItems: number[],
    characterXPosition: number,
    characterYPosition: number
  ) => void
) {
  const prevPositionRef = useRef({ x: character.mapX, y: character.mapY });
  const timeoutRef = useRef<number | null>(null);
  const [itemsData, setItemData] = useState<ItemsMap>(() =>
    convertTo2DArray(MainMapCollectables, mapWidth)
  );
  const [items, setItems] = useState<Item[]>([
    {
      id: 0,
      x: 0,
      y: 0,
      type: 0,
      collected: false,
    },
  ]);

  useEffect(() => {
    const itemsList: Item[] = [];
    for (let y = 0; y < itemsData.length; y++) {
      for (let x = 0; x < itemsData[y].length; x++) {
        if (itemsData[y][x] !== 0) {
          itemsList.push({
            id: itemsList.length,
            x: x * baseTileSize * zoomFactor + (baseTileSize * zoomFactor) / 2,
            y: y * baseTileSize * zoomFactor + (baseTileSize * zoomFactor) / 2,
            type: itemsData[y][x],
            collected: false,
          });
        }
      }
    }
    setItems(itemsList);
  }, [itemsData]);

  const checkItemCollection = useCallback(() => {
    if (
      prevPositionRef.current.x === character.mapX &&
      prevPositionRef.current.y === character.mapY
    ) {
      return;
    }
    prevPositionRef.current = { x: character.mapX, y: character.mapY };
    const collectionRadius = (character.width + character.height) / 10;
    let scoreIncrement = 0;
    let itemsChanged = false;
    setItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (!item.collected) {
          const dx = character.mapX - item.x;
          const dy = character.mapY - item.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < collectionRadius) {
            let points = 0;
            if (item.type === Item1 || item.type === CoinInsideHouse) {
              audioManager.play(AudioSounds.COIN);
              points = 5;
            }
            if (item.type === SuperItem) {
              audioManager.play(AudioSounds.COIN);
              points = 5;
              setCharacter((prev) => ({
                ...prev,
                speed: superJoeSpeed,
                width: superJoeWidth,
                height: superJoeHeight,
              }));
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                setCharacter((prev) => ({
                  ...prev,
                  speed: characterSpeed,
                  width: characterWidth,
                  height: characterHeight,
                }));
                timeoutRef.current = null;
              }, 1000);
            }
            if (item.type === Door) {
              const transitionFunction =
                getLevelTransitionFunction && getLevelTransitionFunction();
              const newCollisions = convertTo2DArray(
                House1Collisions,
                mapWidth
              );
              if (transitionFunction) {
                transitionFunction(
                  House,
                  null,
                  newCollisions,
                  House1Collectables,
                  House1CharacterXPosition,
                  House1CharacterYPosition
                );
              }
            }
            if (item.type === DoorToMainMap) {
              const transitionFunction =
                getLevelTransitionFunction && getLevelTransitionFunction();
              const newCollisions = convertTo2DArray(
                MainMapCollisions,
                mapWidth
              );
              if (transitionFunction) {
                transitionFunction(
                  MainMap,
                  MainMapForeGround,
                  newCollisions,
                  MainMapCollectables,
                  MainMapCharacterXPosition,
                  MainMapCharacterYPosition
                );
              }
            }
            scoreIncrement += points;
            itemsChanged = true;
            return { ...item, collected: true };
          }
        }
        return item;
      });
      if (scoreIncrement > 0) {
        setScore((prev) => prev + scoreIncrement);
      }
      return itemsChanged ? newItems : prevItems;
    });
  }, [
    character.mapX,
    character.mapY,
    setScore,
    setCharacter,
    getLevelTransitionFunction,
  ]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { items, checkItemCollection, itemsData, setItemData };
}
