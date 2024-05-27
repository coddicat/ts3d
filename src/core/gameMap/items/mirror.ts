import type { MapItem } from '../../types';
import {
  getRoomWall,
  roomHeight,
  basementDepth,
  getBasementWall
} from './basic';

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
    getBasementWall(startX, startY),
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
