import { mod } from '../exts';
import settings from '../settings';
import DynamicAlpha from '../dynamicAlpha';
import Painter from './painter';
import type PlayerState from '../player/playerState';
import type Ray from '../ray/ray';
import type RayCasting from '../ray/rayCasting';
import type RayHandler from '../ray/rayHandler';
import type { TextureData } from '../texture/textureData';
import type { Wall, Tile, PixelCounter } from '../types';
import { Axis } from '../types';

class Render {
  private rayHandlerState: RayHandler;
  private playerState: PlayerState;
  private pixelCounter: PixelCounter;
  private painter: Painter;
  private dynamicAlpha: DynamicAlpha;
  private rayCastingState: RayCasting;

  constructor(
    rayCastingState: RayCasting,
    rayHandlerState: RayHandler,
    playerState: PlayerState,
    pixelCounter: PixelCounter
  ) {
    this.rayHandlerState = rayHandlerState;
    this.playerState = playerState;
    this.pixelCounter = pixelCounter;
    this.dynamicAlpha = new DynamicAlpha(playerState, rayHandlerState);
    this.rayCastingState = rayCastingState;

    this.painter = new Painter(pixelCounter, this.dynamicAlpha);
  }

  private drawWall(rayState: Ray, light: number, wall: Wall): void {
    const texture = wall.texture;
    if (!texture) {
      return;
    }

    const textureData = texture.data;
    if (!textureData) {
      return;
    }

    const fact = settings.resolutionHeight / this.rayHandlerState.newDistance;
    const a = this.playerState.halfLookVertical + fact * this.playerState.lookZ;
    const repeatX = texture.repeatX ?? 1;
    const startY = texture.startY ?? 0;
    const startX = texture.startX ?? 0;

    const s =
      rayState.side === Axis.y
        ? mod(rayState.axisY.cellIndex - startY, repeatX)
        : mod(rayState.axisX.cellIndex - startX, repeatX);

    const offset = (rayState.offset + s) / repeatX;

    const y0 = a - wall.top * fact;
    const y1 = a - wall.bottom * fact;

    const top = Math.max(0, (Math.min(y0, y1) + 1) | 0);
    const bottom = Math.min(Math.max(y0, y1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top, settings.resolutionWidth) + this.rayCastingState.displayX;

    this.painter.drawSpriteLine(
      dataIndex,
      y0,
      y1,
      top,
      bottom,

      //spriteX:
      textureData ? (offset * textureData.width) | 0 : 0,

      //repeatedHeight:
      //TODO improve to onetime calculatation
      ((wall.top - wall.bottom) * textureData.height) / texture.repeat,

      texture.revert,

      //checkAlpha
      texture.transparent,
      light,
      textureData
    );
  }

  private drawSprite(
    top: number,
    bottom: number,
    distance: number,
    spriteX: number,
    light: number,
    textureData: TextureData
  ): void {
    const fact = settings.resolutionHeight / distance;
    const a = this.playerState.halfLookVertical + fact * this.playerState.lookZ;
    const y0 = a - top * fact;
    const y1 = a - bottom * fact;

    const top_ = Math.max(0, Math.min(y0, y1) | 0);
    const bottom_ = Math.min(Math.max(y0, y1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top_, settings.resolutionWidth) + this.rayCastingState.displayX;

    this.painter.drawSpriteLine(
      dataIndex,
      y0,
      y1,
      top_,
      bottom_,

      //spriteX:
      spriteX,

      //repeatedHeight:
      textureData.height,

      //revert:
      false,

      //checkAlpha:
      true,

      //light:
      light,

      textureData
    );
  }

  public handleTile(rayState: Ray, tile: Tile): void {
    const textureData = tile.texture?.data;
    if (!textureData) {
      return;
    }

    this.dynamicAlpha.init(tile.bottom);
    const y0 =
      this.playerState.halfLookVertical +
      this.dynamicAlpha.distanceRatio / this.rayHandlerState.newDistance;
    const y1 =
      this.playerState.halfLookVertical +
      this.dynamicAlpha.distanceRatio / this.rayHandlerState.prevDistance;

    const top = Math.max(0, Math.min(y0, y1) | 0);
    const bottom = Math.min(Math.max(y0, y1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top, settings.resolutionWidth) + this.rayCastingState.displayX;

    this.painter.drawSpriteLineDynamic(
      dataIndex,
      top,
      bottom,
      rayState,
      textureData
    );
  }

  public handleSprite(
    top: number,
    bottom: number,
    distance: number,
    spriteX: number,
    textureData: TextureData
  ): void {
    if (distance <= 0) return;

    const light =
      (settings.lookLength - distance) * this.rayHandlerState.alphaMaxLightFact;

    if (light < 1) return;

    this.drawSprite(top, bottom, distance, spriteX, light, textureData);
  }

  public handleWalls(rayState: Ray): void {
    if (!this.rayHandlerState.newItem || this.rayHandlerState.newDistance <= 0)
      return;

    const light =
      (settings.lookLength - this.rayHandlerState.newDistance) *
      this.rayHandlerState.alphaMaxLightFact;

    if (light < 1) return;

    for (const wall of this.rayHandlerState.newItem.walls) {
      this.drawWall(rayState, light, wall);
      if (!this.pixelCounter.empty) return;
    }
  }
}

export default Render;
