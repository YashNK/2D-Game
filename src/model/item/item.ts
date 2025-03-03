export interface Item {
  id: number;
  x: number;
  y: number;
  type: number;
  collected: boolean;
}

export type ItemsMap = number[][];
