import { mod } from '../exts';
import settings from '../settings';
import DynamicAlpha from '../dynamicAlpha';
import Painter from './painter';
import type PlayerState from '../player/playerState';
import type Ray from '../ray/ray';
import type RayCasting from '../ray/rayCasting';
import type RayHandler from '../ray/rayHandler';
import type { TextureData } from '../texture/textureData';
import type { Wall, Level, PixelCounter } from '../types';
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
    const fact = settings.resolution.height / this.rayHandlerState.newDistance;
    const a = this.playerState.halfLookVertical + fact * this.playerState.lookZ;
    const repeatX = wall.texture?.repeatX ?? 1;
    const startY = wall.texture?.startY ?? 0;
    const startX = wall.texture?.startX ?? 0;

    const s =
      rayState.side === Axis.y
        ? mod(rayState.axisY.cellIndex - startY, repeatX)
        : mod(rayState.axisX.cellIndex - startX, repeatX);

    const offset = (rayState.offset + s) / repeatX;

    const y0 = a - wall.top * fact;
    const y1 = a - wall.bottom * fact;

    const top = Math.max(0, Math.min(y0, y1) | 0);
    const bottom = Math.min((Math.max(y0, y1) + 1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top, settings.resolution.width) + this.rayCastingState.displayX;

    if (settings.wallTexture && wall!.texture?.data) {
      this.painter.drawSpriteLine(
        dataIndex,
        y0,
        y1,
        top,
        bottom,

        //spriteX:
        wall.texture?.data ? (offset * wall.texture?.data.width) | 0 : 0,

        //repeatedHeight:
        //TODO improve to onetime calculatation
        ((wall.top - wall.bottom) * wall.texture.data.height) /
          wall.texture.repeat,

        //revert
        wall.texture.revert,

        //checkAlpha
        wall.texture.transparent,

        //light:
        light,

        //textureData
        wall.texture?.data
      );
    } else {
      this.painter.drawLineStatic(dataIndex, top, bottom, wall.color, light);
    }
  }

  private drawSprite(
    top: number,
    bottom: number,
    distance: number,
    spriteX: number,
    light: number,
    textureData: TextureData
  ): void {
    const fact = settings.resolution.height / distance;
    const a = this.playerState.halfLookVertical + fact * this.playerState.lookZ;
    const y0 = a - top * fact;
    const y1 = a - bottom * fact;

    const top_ = Math.max(0, Math.min(y0, y1) | 0);
    const bottom_ = Math.min(Math.max(y0, y1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top_, settings.resolution.width) +
      this.rayCastingState.displayX;

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

  public handleLevel(rayState: Ray, level: Level): void {
    this.dynamicAlpha.init(level.bottom);
    const y0 =
      this.playerState.halfLookVertical +
      this.dynamicAlpha.distanceRate / this.rayHandlerState.newDistance;
    const y1 =
      this.playerState.halfLookVertical +
      this.dynamicAlpha.distanceRate / this.rayHandlerState.prevDistance;

    const top = Math.max(0, Math.min(y0, y1) | 0);
    const bottom = Math.min((Math.max(y0, y1) + 1) | 0, settings.maxBottom);
    const dataIndex =
      Math.imul(top, settings.resolution.width) + this.rayCastingState.displayX;

    if (settings.levelTexture && level.texture?.data) {
      this.painter.drawSpriteLineDynamic(
        dataIndex,
        top,
        bottom,
        rayState,
        level.texture?.data
      );
    } else {
      this.painter.drawLineDynamic(dataIndex, top, bottom, level.color);
    }
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
      if (wall.render) this.drawWall(rayState, light, wall);
      if (!this.pixelCounter.empty) return;
    }
  }
}

export default Render;
