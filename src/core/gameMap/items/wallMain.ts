import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';
import { basementWall, roomHeight } from './basic';

export const getWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall => ({
  top,
  bottom,
  texture: new TextureSet(
    TextureType.WallMain,
    roomHeight,
    startX,
    startY,
    2,
    revert
  )
});

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [getWall(startX, startY, roomHeight, 0), basementWall],
  levels: [],
  stopRay: true
});
