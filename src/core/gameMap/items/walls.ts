import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { MapItemType } from '../mapItemType';

export default new Map<MapItemType, MapItem>([
  [
    MapItemType.LowWallCoridor,
    {
      walls: [
        {
          top: 2.5,
          bottom: 0,
          texture: new Texture(TextureType.LowWallCoridor, 1.25)
        }
      ],
      levels: [],
      stopRay: true
    }
  ]
]);
