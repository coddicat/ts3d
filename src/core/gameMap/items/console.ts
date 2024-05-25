import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { floor, roomCeil } from './basic';

const height = 0.7;
const wall = {
  bottom: height - 0.25,
  top: height,
  color: 0x02f00,
  render: true,
  texture: new Texture(TextureType.WallMain)
};

const getItem = (texture: TextureType): MapItem => ({
  walls: [wall],
  levels: [
    floor,
    roomCeil,
    {
      name: 'top',
      color: 0x02f00,
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
