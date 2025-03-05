import { Canvas } from "../model/canvas";
import {
  frameWidth,
  frameHeight,
  baseTileSize,
  Item1,
  SuperItem,
  CoinInsideHouse,
} from "../constants";
import { MapData } from "../model/map";
import { Item } from "../model/item/item";
import { CharacterData } from "../model/character";
import Coin from "../assets/images/coin.png";
import Diamond from "../assets/images/diamon.webp";

export class Renderer {
  private canvas: Canvas;
  private mapData: MapData;
  private mapImage: HTMLImageElement;
  private mapImageForeground: HTMLImageElement | null;
  private coinImage: HTMLImageElement;
  private diamondImage: HTMLImageElement;

  constructor(canvas: Canvas, mapData: MapData) {
    this.canvas = canvas;
    this.mapData = mapData;
    this.mapImage = new Image();
    this.mapImage.src = mapData.currentLevel;
    this.mapImageForeground = new Image();
    if (mapData.currentLevelForeground)
      this.mapImageForeground.src = mapData.currentLevelForeground;
    this.coinImage = new Image();
    this.coinImage.src = Coin;
    this.diamondImage = new Image();
    this.diamondImage.src = Diamond;
  }

  public render(
    context: CanvasRenderingContext2D,
    character: CharacterData,
    items: Item[],
    sprites: Record<string, HTMLImageElement>,
    frameIndex: number
  ): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const viewX = Math.max(
      0,
      Math.min(
        character.mapX - this.canvas.width / 2,
        this.mapData.width - this.canvas.width
      )
    );
    const viewY = Math.max(
      0,
      Math.min(
        character.mapY - this.canvas.height / 2,
        this.mapData.height - this.canvas.height
      )
    );
    this.drawBackground(context, viewX, viewY);
    this.drawItems(context, items, viewX, viewY);
    this.drawCharacter(context, character, sprites, viewX, viewY, frameIndex);
    this.drawForeground(context, viewX, viewY);
  }

  private drawCharacter(
    context: CanvasRenderingContext2D,
    character: CharacterData,
    sprites: Record<string, HTMLImageElement>,
    viewX: number,
    viewY: number,
    frameIndex: number
  ): void {
    const charX = character.mapX - viewX - character.width / 2;
    const charY = character.mapY - viewY - character.height / 2;
    let spriteKey = "idle-down-right";
    if (character.isDashing) {
      spriteKey = `dashing-${character.direction}`;
    } else if (character.isWalking) {
      spriteKey = `running-${character.direction}`;
    } else {
      spriteKey = `idle-${character.direction}`;
    }
    const characterImage = sprites[spriteKey];
    if (characterImage) {
      context.drawImage(
        characterImage,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        charX,
        charY,
        character.width,
        character.height
      );
    }
  }

  private drawBackground(
    context: CanvasRenderingContext2D,
    viewX: number,
    viewY: number
  ): void {
    context.drawImage(
      this.mapImage,
      viewX,
      viewY,
      this.canvas.width,
      this.canvas.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  private drawForeground(
    context: CanvasRenderingContext2D,
    viewX: number,
    viewY: number
  ): void {
    if (this.mapImageForeground)
      context.drawImage(
        this.mapImageForeground,
        viewX,
        viewY,
        this.canvas.width,
        this.canvas.height,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
  }

  private drawItems(
    context: CanvasRenderingContext2D,
    items: Item[],
    viewX: number,
    viewY: number
  ): void {
    items.forEach((item) => {
      if (!item.collected) {
        const itemX = item.x - viewX - baseTileSize / 2;
        const itemY = item.y - viewY - baseTileSize / 2;
        if (
          itemX >= -baseTileSize &&
          itemX <= this.canvas.width + baseTileSize &&
          itemY >= -baseTileSize &&
          itemY <= this.canvas.height + baseTileSize
        ) {
          context.save();
          if (item.type === Item1 || item.type === CoinInsideHouse) {
            context.drawImage(this.coinImage, itemX, itemY, 32, 32);
          }
          if (item.type === SuperItem) {
            context.drawImage(this.diamondImage, itemX, itemY, 64, 64);
          }
          context.restore();
        }
      }
    });
  }
}
