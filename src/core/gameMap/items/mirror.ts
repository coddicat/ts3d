import type { MapItem } from '../../types';
import { basementDepth, basementWall, roomHeight } from './basic';
import { getWall as getMainWall } from './wallMain';

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [
    getMainWall(startX, startY, roomHeight, 2.8, false),
    getMainWall(startX, startY, 0.5, 0, true),
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
  transparent: 0.75
});
