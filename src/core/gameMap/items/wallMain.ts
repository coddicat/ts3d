import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';

export const getWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall => ({
  top,
  bottom,
  texture: new TextureSet(TextureType.WallMain, 3.5, startX, startY, 2, revert)
});

export const basementWall = {
  top: 0,
  bottom: -2.4,
  texture: new Texture(TextureType.WallBasement, 2.4)
} as Wall;

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [getWall(startX, startY, 3.5, 0, false), basementWall],
  levels: [],
  stopRay: true
});
