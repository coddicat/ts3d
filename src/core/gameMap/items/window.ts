import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import Texture from '../../texture/texture';
import type { MapItem } from '../../types';
import { getRoomWall, roomHeight, basementWall } from './basic';

const windowTop = 2.8;
const windowBottom = 0.5;
const windowTransparent = 0.6;

export const windowWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    {
      top: windowTop,
      bottom: windowBottom,
      texture: new TextureSet(
        TextureType.Window,
        windowTop - windowBottom,
        startX,
        startY,
        2,
        false,
        true
      )
    },
    getRoomWall(startX, startY, roomHeight, windowTop, false),
    getRoomWall(startX, startY, windowBottom, 0, true),
    basementWall
  ],
  levels: [
    {
      bottom: windowBottom,
      texture: new Texture(TextureType.FloorMetal)
    },
    {
      bottom: windowTop,
      texture: new Texture(TextureType.FloorMetal)
    }
  ],
  stopRay: false,
  transparent: windowTransparent
});
