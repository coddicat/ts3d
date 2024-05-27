import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { getRoomWall, roomHeight, getBasementWall } from './basic';

const panoramaTop = 2.8;
const panoramaBottom = 0.5;
const panoramaTransparent = 0.6;

export const panoramaWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    {
      top: panoramaTop,
      bottom: panoramaBottom,
      texture: new TextureSet(
        TextureType.Window,
        panoramaTop - panoramaBottom,
        startX,
        startY,
        2,
        false,
        true
      )
    },
    getRoomWall(startX, startY, roomHeight, panoramaTop, false),
    getRoomWall(startX, startY, panoramaBottom, 0, true),
    getBasementWall(startX, startY)
  ],
  tiles: [],
  stopRay: false,
  transparent: panoramaTransparent
});
