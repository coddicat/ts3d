import type { MapItem } from '../../types';
import {
  basementFloor,
  coridorCeil,
  coridorHeight,
  floor,
  roomHeight
} from './basic';
import { getWall } from './wallMain';

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [getWall(startX, startY, roomHeight, coridorHeight)],
  levels: [basementFloor, floor, coridorCeil],
  stopRay: false
});
