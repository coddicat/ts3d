import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import Texture from '../../texture/texture';
import type { MapItem } from '../../types';
import { getRoomWall, roomHeight, getBasementWall } from './basic';

const windowTop = 2.8;
const windowBottom = 0.5;
const windowTransparent = 0.6;

export const getWindowWall = (startX: number, startY: number) => ({
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
});

export const windowWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getWindowWall(startX, startY),
    getRoomWall(startX, startY, roomHeight, windowTop, false),
    getRoomWall(startX, startY, windowBottom, 0, true),
    getBasementWall(startX, startY)
  ],
  levels: [
    {
      bottom: windowBottom,
      texture: new Texture(TextureType.RoomFloor)
    },
    {
      bottom: windowTop,
      texture: new Texture(TextureType.RoomFloor)
    }
  ],
  stopRay: false,
  transparent: windowTransparent
});
