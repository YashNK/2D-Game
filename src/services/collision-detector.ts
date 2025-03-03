import { CollisionMap } from "../model/map";
import {
  baseTileSize,
  zoomFactor,
  mapWidth,
  mapHeight,
  actualCharWidth,
  actualCharHeight,
} from "../constants";

export class CollisionDetector {
  private collisionData: CollisionMap;

  constructor(collisionData: CollisionMap) {
    this.collisionData = collisionData;
  }

  public setCollisionData(collisionData: CollisionMap): void {
    this.collisionData = collisionData;
  }

  public hasCollision(x: number, y: number): boolean {
    if (!this.collisionData || this.collisionData.length === 0) {
      return false;
    }
    const hitBoxLeftX = x - actualCharWidth / 2;
    const hitBoxRightX = x + actualCharWidth / 2;
    const hitBoxBottomY = y + actualCharHeight / 2 + 20;
    const hitBoxTopY = y - actualCharHeight / 2;
    const collisions = {
      topLeft: this.checkCollisionAtPoint(hitBoxLeftX, hitBoxTopY),
      topRight: this.checkCollisionAtPoint(hitBoxRightX, hitBoxTopY),
      bottomLeft: this.checkCollisionAtPoint(hitBoxLeftX, hitBoxBottomY),
      bottomRight: this.checkCollisionAtPoint(hitBoxRightX, hitBoxBottomY),
      center: this.checkCollisionAtPoint(x, y),
    };
    return (
      collisions.topLeft ||
      collisions.topRight ||
      collisions.bottomLeft ||
      collisions.bottomRight ||
      collisions.center
    );
  }

  private checkCollisionAtPoint(x: number, y: number): boolean {
    const tileX = Math.floor(x / (baseTileSize * zoomFactor));
    const tileY = Math.floor(y / (baseTileSize * zoomFactor));
    if (tileX < 0 || tileX >= mapWidth || tileY < 0 || tileY >= mapHeight) {
      return true;
    }
    if (
      !this.collisionData[tileY] ||
      this.collisionData[tileY][tileX] === undefined
    ) {
      return false;
    }
    const collides = this.collisionData[tileY][tileX] !== 0;
    return collides;
  }
}
