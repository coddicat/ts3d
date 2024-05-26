import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';

export default {
  walls: [
    {
      top: -1,
      bottom: -2,
      texture: new Texture(TextureType.FloorMetal, 1)
    }
  ],
  levels: [
    {
      bottom: -1,
      texture: new Texture(TextureType.FloorMetal, 1)
    }
  ],
  stopRay: false
} as MapItem;
