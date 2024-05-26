import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';
import { floor, roomCeil } from './basic';

const height = 0.6;
const wall: Wall = {
  bottom: height - 0.25,
  top: height,
  texture: new Texture(TextureType.WallMain)
};

const getItem = (texture: TextureType): MapItem => ({
  walls: [wall],
  levels: [
    floor,
    roomCeil,
    {
      name: 'top',
      bottom: height,
      texture: new Texture(texture)
    }
  ],
  stopRay: false
});

export const console11: MapItem = getItem(TextureType.Console11);
export const console12: MapItem = getItem(TextureType.Console12);
export const console13: MapItem = getItem(TextureType.Console13);
export const console21: MapItem = getItem(TextureType.Console21);
export const console22: MapItem = getItem(TextureType.Console22);
export const console23: MapItem = getItem(TextureType.Console23);
