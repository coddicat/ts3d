import { getWall as getMainWall } from './wallMain';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import Texture from '../../texture/texture';
import type { MapItem } from '../../types';
import { basementWall, roomHeight } from './basic';

export default (_: number, startX: number, startY: number): MapItem => ({
  walls: [
    {
      top: 2.8,
      bottom: 0.5,
      texture: new TextureSet(
        TextureType.Window,
        2.3,
        startX,
        startY,
        2,
        false,
        true
      )
    },
    getMainWall(startX, startY, roomHeight, 2.8, false),
    getMainWall(startX, startY, 0.5, 0, true),
    basementWall
  ],
  levels: [
    {
      bottom: 0.5,
      texture: new Texture(TextureType.FloorMetal)
    },
    {
      bottom: 2.8,
      texture: new Texture(TextureType.FloorMetal)
    }
  ],
  stopRay: false,
  transparent: 0.6
});
