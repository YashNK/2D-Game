import { CollisionMap } from "../model/map";

export const convertTo2DArray = (
  array: number[],
  width: number
): CollisionMap => {
  const result: number[][] = [];
  for (let i = 0; i < array.length; i += width) {
    result.push(array.slice(i, i + width));
  }
  return result;
};
