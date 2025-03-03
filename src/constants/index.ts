//Tile Details
export const baseTileSize = 16;

//Map Details
export const mapWidth = 70;
export const mapHeight = 40;
export const zoomFactor = 5.5;
export const totalMapWidthPx = mapWidth * baseTileSize * zoomFactor;
export const totalMapHeightPx = mapHeight * baseTileSize * zoomFactor;

//Character Details
export const actualCharWidth = 16;
export const actualCharHeight = 32;
export const characterWidth = 100;
export const characterHeight = 190;
export const frameWidth = 48;
export const frameHeight = 64;
export const characterXPosition = totalMapWidthPx / 2 - characterWidth / 2;
export const characterYPosition = totalMapHeightPx / 2 - characterHeight / 2;
export const characterSpeed = 2;
export const initialXPosition = 650;
export const initialYPosition = 650;
export const dashSpeedMultiplier = 5;
export const dashDuration = 300;
export const dashCoolDown = 1000;
export const superJoeSpeed = 5;
export const superJoeWidth = 120;
export const superJoeHeight = 210;

//Item Id
export const SuperItem = 1732;
export const Item1 = 1733;

//Audio constants
export enum AudioSounds {
  COIN = "coin",
  GAME = "game",
}
