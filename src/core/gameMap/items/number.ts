import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';
import { roomHeight, basementFloor } from './basic';

export const floorNumber: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Numbers)
};
export const ceilNumber: Level = {
  bottom: roomHeight,
  texture: new Texture(TextureType.Numbers)
};

export const numberSpace: MapItem = {
  walls: [],
  levels: [basementFloor, floorNumber, ceilNumber],
  stopRay: false
};
