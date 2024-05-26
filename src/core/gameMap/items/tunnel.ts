import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { ItemSetGetter, Level, MapItem } from '../../types';
import { basementFloor, coridorFloor, roomHeight } from './basic';
import { getWall } from './wallMain';

export const tunnelHeight = 2.5;

export const tunnelCeil: Level = {
  bottom: tunnelHeight,
  texture: new Texture(TextureType.CoridorCeil)
};

export const tunnelWall: MapItem = {
  walls: [
    {
      top: tunnelHeight,
      bottom: 0,
      texture: new Texture(TextureType.TunnelWall, tunnelHeight)
    }
  ],
  levels: [],
  stopRay: true
};

export const tunnelSpace: ItemSetGetter = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getWall(startX, startY, roomHeight, tunnelHeight)],
  levels: [basementFloor, coridorFloor, tunnelCeil],
  stopRay: false
});
