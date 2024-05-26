import { mod } from '../exts';
import settings from '../settings';
import type DynamicAlpha from '../dynamicAlpha';
import type Ray from '../ray/ray';
import type { TextureData } from '../texture/textureData';
import type { PixelCounter } from '../types';
import type { RayAngle } from '../ray/rayAngle';

class Painter {
  private dynamicAlpha;
  private pixelsCounter: PixelCounter;

  constructor(pixelsCounter: PixelCounter, dynamicAlpha: DynamicAlpha) {
    this.pixelsCounter = pixelsCounter;
    this.dynamicAlpha = dynamicAlpha;
  }

  public drawSpriteLine(
    dataIndex: number,
    y0: number,
    y1: number,
    top: number,
    bottom: number,

    spriteX: number,
    repeatedHeight: number,
    revert: boolean | undefined,
    checkAlpha: boolean,
    light: number,
    textureData: TextureData
  ): void {
    if (light < 1 || top === bottom) return;
    const alphaMask = 0x00ffffff | (light << 24);
    const diff = top - y0;
    const ratio = repeatedHeight / (y1 - y0);
    let spriteY = revert
      ? diff +
        //todo
        (textureData.height - mod(repeatedHeight, textureData.height)) / ratio
      : diff;
    const width = settings.resolution.width;
    while (top <= bottom) {
      if (settings.data[dataIndex]) {
        top++;
        dataIndex += width;
        spriteY++;
        continue;
      }

      const index =
        Math.imul(
          mod((spriteY * ratio) | 0, textureData.height),
          textureData.width
        ) + spriteX;

      const pixel = textureData.data[index];

      if (checkAlpha && !pixel) {
        top++;
        dataIndex += width;
        spriteY++;
        continue;
      }

      settings.data[dataIndex] = pixel & alphaMask;

      if (!this.pixelsCounter.increse()) return;

      top++;
      dataIndex += width;
      spriteY++;
    }
  }

  public getSpriteIndexBySideX_positive(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width } = textureData;

    const fixCosDiff = rayAngle.fixCos * diff;
    const sideX = offset - fixCosDiff + (fixCosDiff | 0) + 1;
    const spriteX = ((sideX - (sideX | 0)) * width) | 0;
    const spriteY = (diff * textureData.factY) | 0;
    const fixedX = textureData.maxY - mod(spriteY, textureData.height);
    return Math.imul(fixedX, width) + spriteX;
  }
  public getSpriteIndexBySideY_positive(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width } = textureData;

    const fixSinDiff = rayAngle.fixSin * diff;
    const side = offset - fixSinDiff + (fixSinDiff | 0) + 1;
    const spriteY = (side - (side | 0)) * textureData.height;
    const spriteX = (diff * textureData.factX) | 0;
    const fixedX = textureData.maxX - mod(spriteX, width);
    return Math.imul(spriteY, width) + fixedX;
  }
  public getSpriteIndexBySideX_negative(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width } = textureData;

    const fixCosDiff = rayAngle.fixCos * diff;
    const sideX = offset - fixCosDiff + (fixCosDiff | 0) + 1;
    const spriteX = ((sideX - (sideX | 0)) * width) | 0;
    const spriteY = (diff * textureData.factY) | 0;
    const fixedX = mod(spriteY, textureData.height);
    return Math.imul(fixedX, width) + spriteX;
  }
  public getSpriteIndexBySideY_negative(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width } = textureData;

    const fixSinDiff = rayAngle.fixSin * diff;
    const side = offset - fixSinDiff + (fixSinDiff | 0) + 1;
    const spriteY = (side - (side | 0)) * textureData.height;
    const spriteX = (diff * textureData.factX) | 0;
    const fixedX = mod(spriteX, width);
    return Math.imul(spriteY, width) + fixedX;
  }

  public drawSpriteLineDynamic(
    dataIndex: number,
    top: number,
    bottom: number,
    rayState: Ray,
    textureData: TextureData
  ): void {
    const { rayAngle } = rayState;
    if (textureData.rayTimestamp !== rayAngle.timestamp) {
      textureData.factX = textureData.width * rayAngle.fixCosAbs;
      textureData.factY = textureData.height * rayAngle.fixSinAbs;
      textureData.rayTimestamp = rayAngle.timestamp;
    }

    while (top <= bottom) {
      if (settings.data[dataIndex]) {
        top++;
        dataIndex += settings.resolution.width;
        continue;
      }

      this.dynamicAlpha.setDistanceAlpha(top);

      if (this.dynamicAlpha.alpha < 1) {
        top++;
        dataIndex += settings.resolution.width;
        continue;
      }

      const diff = Math.abs(
        rayState.fixedDistance - this.dynamicAlpha.distance
      );
      const pixel =
        textureData.data[
          rayState.spriteIndexGetter(
            rayAngle,
            rayState.offset,
            textureData,
            diff
          )
        ];

      if (!pixel) {
        top++;
        dataIndex += settings.resolution.width;
        continue;
      }

      settings.data[dataIndex] =
        (this.dynamicAlpha.alpha << 24) | (pixel & 0x00ffffff);

      if (!this.pixelsCounter.increse()) return;

      top++;
      dataIndex += settings.resolution.width;
    }
  }
}

export default Painter;
