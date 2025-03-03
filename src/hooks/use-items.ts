import { useState, useCallback, useEffect, useRef } from "react";
import { convertTo2DArray } from "../utils/common.fns";
import { Collectables } from "../constants/collectables";
import {
  mapWidth,
  baseTileSize,
  zoomFactor,
  characterWidth,
  characterHeight,
  Item1,
  characterSpeed,
  superJoeSpeed,
  superJoeWidth,
  superJoeHeight,
  AudioSounds,
  SuperItem,
} from "../constants";
import { audioManager } from "../utils/audio.fns";
import { Item, ItemsMap } from "../model/item/item";
import { CharacterData } from "../model/character";

export function useItems(
  character: CharacterData,
  setCharacter: React.Dispatch<React.SetStateAction<CharacterData>>,
  setScore: React.Dispatch<React.SetStateAction<number>>
) {
  const prevPositionRef = useRef({ x: character.mapX, y: character.mapY });
  const timeoutRef = useRef<number | null>(null);
  const [itemsData] = useState<ItemsMap>(() =>
    convertTo2DArray(Collectables, mapWidth)
  );
  const [items, setItems] = useState<Item[]>(() => {
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
    return itemsList;
  });

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
            if (item.type === Item1) {
              audioManager.play(AudioSounds.COIN);
              points = 5;
            }
            if (item.type === SuperItem) {
              audioManager.play(AudioSounds.COIN);
              points = 20;
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
  }, [character.mapX, character.mapY, setScore, setCharacter]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { items, checkItemCollection };
}
