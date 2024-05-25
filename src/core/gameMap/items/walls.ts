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
          color: 0xdcc8c8,
          top: 2.5,
          bottom: 0,
          render: true,
          texture: new Texture(TextureType.LowWallCoridor, 1.25)
        }
      ],
      levels: [],
      stopRay: true
    }
  ]
]);
