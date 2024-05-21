import { MapItem } from '../../types';
import { MapItemType } from '../mapItemType';
import { floor } from './basic';
import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';

export default new Map<MapItemType, MapItem>([
  [
    MapItemType.TowerLedge,
    {
      walls: [
        {
          color: 0xffffff,
          top: 10,
          bottom: 4,
          render: true,
          texture: new Texture(TextureType.WallBriks, 1),
        },
      ],
      levels: [
        {
          color: 0x969696,
          bottom: 4,
          texture: new Texture(TextureType.FloorMetal, 1),
        },
        floor,
      ],
      stopRay: false,
    },
  ],
  
]);
