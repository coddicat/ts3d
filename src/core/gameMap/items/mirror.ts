import type { MapItem } from '../../types';
import { getRoomWall, roomHeight, basementWall, basementDepth } from './basic';

const mirrorTransparent = 0.75;
const mirrorTop = 2.5;
const mirrorBottom = 0.5;

export const mirrorWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getRoomWall(startX, startY, roomHeight, mirrorTop, false),
    getRoomWall(startX, startY, mirrorBottom, 0, true),
    basementWall,
    //collision
    {
      top: roomHeight,
      bottom: basementDepth
    }
  ],
  levels: [],
  stopRay: true,
  mirror: true,
  transparent: mirrorTransparent
});
