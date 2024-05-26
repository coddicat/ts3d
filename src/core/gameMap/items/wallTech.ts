import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';
import { basementWall } from './wallMain';

export const getWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall => ({
  top,
  bottom,
  texture: new TextureSet(TextureType.Tech, 3.5, startX, startY, 8, revert)
});

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [getWall(startX, startY, 3.5, 0, false), basementWall],
  levels: [],
  stopRay: true
});
