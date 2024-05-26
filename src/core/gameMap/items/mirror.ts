import type { MapItem } from '../../types';
import { basementWall, getWall as getMainWall } from './wallMain';

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [
    getMainWall(startX, startY, 3.5, 2.8, false),
    getMainWall(startX, startY, 0.5, 0, true),
    basementWall,
    //collision
    {
      top: 3.5,
      bottom: 0
    }
  ],
  levels: [],
  stopRay: true,
  mirror: true,
  transparent: 0.75
});
