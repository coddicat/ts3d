import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';

export default {
  walls: [
    {
      color: 0xffffff,
      top: 2,
      bottom: 0,
      render: true,
      texture: new Texture(TextureType.FloorMetal, 1)
    }
  ],
  levels: [],
  stopRay: false
} as MapItem;
