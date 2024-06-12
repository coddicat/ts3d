import { mod } from '../exts';
import settings from '../settings';
import type DynamicAlpha from './dynamicAlpha';
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
    textureData: TextureData,
    heightFactor: number
  ): void {
    if (light < 1 || top === bottom) return;
    const alphaMask = 0x00ffffff | (light << 24);
    const dy = top - y0;
    const ratio = repeatedHeight / (y1 - y0);

    let spriteY = revert ? dy + heightFactor / ratio : dy;
    const { resolutionWidth, data } = settings;
    const { height, width, data: textureImageData } = textureData;
    const length = textureImageData.length;

    for (0; top <= bottom; top++, dataIndex += resolutionWidth, spriteY++) {
      if (data[dataIndex]) continue;

      const index =
        Math.imul(mod((spriteY * ratio) | 0, height), width) + spriteX;

      if (index < 0) continue;
      if (index >= length) break;

      const pixel = textureImageData[index];

      if (checkAlpha && !pixel) continue;
      data[dataIndex] = pixel & alphaMask;

      if (!this.pixelsCounter.increse()) return;
    }
  }

  public getTileSpriteIndexBySideX_positive(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width, height, factY, maxY } = textureData;

    const fixCosDiff = rayAngle.fixCos * diff;
    const sideX = offset - fixCosDiff + (fixCosDiff | 0) + 1;
    const spriteX = ((sideX - (sideX | 0)) * width) | 0;
    const spriteY = (diff * factY) | 0;
    const fixedX = maxY - mod(spriteY, height);
    return Math.imul(fixedX, width) + spriteX;
  }
  public getTileSpriteIndexBySideY_positive(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width, height, factX, maxX } = textureData;

    const fixSinDiff = rayAngle.fixSin * diff;
    const side = offset - fixSinDiff + (fixSinDiff | 0) + 1;
    const spriteY = (side - (side | 0)) * height;
    const spriteX = (diff * factX) | 0;
    const fixedX = maxX - mod(spriteX, width);
    return Math.imul(spriteY, width) + fixedX;
  }
  public getTileSpriteIndexBySideX_negative(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width, height, factY } = textureData;

    const fixCosDiff = rayAngle.fixCos * diff;
    const sideX = offset - fixCosDiff + (fixCosDiff | 0) + 1;
    const spriteX = ((sideX - (sideX | 0)) * width) | 0;
    const spriteY = (diff * factY) | 0;
    const fixedX = mod(spriteY, height);
    return Math.imul(fixedX, width) + spriteX;
  }
  public getTileSpriteIndexBySideY_negative(
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ): number {
    const { width, height, factX } = textureData;

    const fixSinDiff = rayAngle.fixSin * diff;
    const side = offset - fixSinDiff + (fixSinDiff | 0) + 1;
    const spriteY = (side - (side | 0)) * height;
    const spriteX = (diff * factX) | 0;
    const fixedX = mod(spriteX, width);
    return Math.imul(spriteY, width) + fixedX;
  }

  public drawTileSpriteLine(
    dataIndex: number,
    top: number,
    bottom: number,
    rayState: Ray,
    textureData: TextureData
  ): void {
    const { rayAngle, fixedDistance } = rayState;
    const { resolutionWidth, data } = settings;

    if (textureData.rayTimestamp !== rayAngle.timestamp) {
      textureData.factX = textureData.width * rayAngle.fixCosAbs;
      textureData.factY = textureData.height * rayAngle.fixSinAbs;
      textureData.rayTimestamp = rayAngle.timestamp;
    }

    const length = textureData.data.length;

    for (0; top <= bottom; top++, dataIndex += resolutionWidth) {
      if (data[dataIndex]) continue;

      const alpha = this.dynamicAlpha.setDistanceAlpha(top);

      if (alpha < 1) continue;

      const diff = Math.abs(fixedDistance - this.dynamicAlpha.distance);
      const index = rayState.spriteIndexGetter(
        rayAngle,
        rayState.offset,
        textureData,
        diff
      );

      if (index < 0 || index >= length) continue;

      const pixel = textureData.data[index];
      if (!pixel) continue;
      data[dataIndex] = (alpha << 24) | (pixel & 0x00ffffff);

      if (!this.pixelsCounter.increse()) break;
    }
  }
}

export default Painter;
