import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';

export default {
  walls: [
    {
      color: 0xffffff,
      top: 4,
      bottom: 2.5,
      render: true,
      texture: new Texture(TextureType.WallMetal, 2)
    },
    {
      color: 0xffffff,
      top: 0.25,
      bottom: 0,
      render: true,
      texture: new Texture(TextureType.WallMetal, 2)
    },
    //for collision
    {
      color: 0,
      top: 4,
      bottom: 0,
      render: false,
      texture: null
    }
  ],
  levels: [],
  stopRay: false,
  mirror: true
} as MapItem;
