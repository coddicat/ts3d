import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import { type ItemSetGetter, type Tile, type MapItem, Wall } from '../../types';
import { coridorFloor } from './coridor';
import { getRoomWall, roomHeight, basementFloor } from './basic';

export const tunnelHeight = 2.5;

export const tunnelCeil: Tile = {
  bottom: tunnelHeight,
  texture: new Texture(TextureType.CoridorCeil)
};

export const tunnelWall: MapItem = {
  walls: [
    new Wall(tunnelHeight, 0, new Texture(TextureType.TunnelWall, tunnelHeight))
  ],
  tiles: [],
  stopRay: true
};

export const tunnelSpace: ItemSetGetter = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getRoomWall(startX, startY, roomHeight, tunnelHeight)],
  tiles: [basementFloor, coridorFloor, tunnelCeil],
  stopRay: false
});
