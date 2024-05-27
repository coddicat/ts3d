import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Tile, MapItem } from '../../types';
import { roomHeight, basementFloor } from './basic';

export const floorNumber: Tile = {
  bottom: 0,
  texture: new Texture(TextureType.Numbers)
};
export const ceilNumber: Tile = {
  bottom: roomHeight,
  texture: new Texture(TextureType.Numbers)
};

export const numberSpace: MapItem = {
  walls: [],
  tiles: [basementFloor, floorNumber, ceilNumber],
  stopRay: false
};
