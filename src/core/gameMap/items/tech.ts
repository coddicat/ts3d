import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';
import { roomHeight, basementWall } from './basic';

const getTechWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall => ({
  top,
  bottom,
  texture: new TextureSet(
    TextureType.Tech,
    roomHeight,
    startX,
    startY,
    8,
    revert
  )
});

export const techWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getTechWall(startX, startY, roomHeight, 0, false), basementWall],
  levels: [],
  stopRay: true
});
