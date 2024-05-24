import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';

export default {
  walls: [
    {
      color: 0xffffff,
      top: 3.5,
      bottom: 2.5,
      render: true,
      texture: new Texture(TextureType.WallMetal, 1)
    },
    {
      color: 0xffffff,
      top: 0.25,
      bottom: 0,
      render: true,
      texture: new Texture(TextureType.WallMetal, 1)
    },
    //for collision
    {
      color: 0,
      top: 3.5,
      bottom: 0,
      render: false,
      texture: null
    }
  ],
  levels: [],
  stopRay: false,
  mirror: true
} as MapItem;
