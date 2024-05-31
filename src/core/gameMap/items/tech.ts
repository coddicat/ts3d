import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import { type MapItem, Wall } from '../../types';
import { roomHeight, getBasementWall } from './basic';

const getTechWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall =>
  new Wall(
    top,
    bottom,
    new TextureSet(TextureType.Tech, roomHeight, startX, startY, 8, revert)
  );

export const techWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getTechWall(startX, startY, roomHeight, 0, false),
    getBasementWall(startX, startY)
  ],
  tiles: [],
  stopRay: true
});
