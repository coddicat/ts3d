import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { MapItemType } from '../mapItemType';
import { roomCeil, basementFloor } from './basic';
import Texture from '../../texture/texture';

function stair(top: number, wood: boolean = false): MapItem {
  const bottom = (((top - 0.3) * 1000) | 0) / 1000;
  const texture = wood
    ? new Texture(TextureType.Wood, 1)
    : new Texture(TextureType.Parquet, 1);

  const walls = [
    {
      color: 0xc80fff,
      top,
      bottom,
      render: true,
      texture: texture
    }
  ];

  const levelTop = {
    color: 0x6496fa,
    bottom: top,
    texture: texture
  };

  const levelBottom = {
    color: 0x6496fa,
    bottom: bottom,
    texture: texture
  };

  const levels = [basementFloor, levelBottom, levelTop, roomCeil];
  const item = {
    walls,
    levels,
    stopRay: false
  };
  return item;
}

export default new Map<MapItemType, MapItem>([
  [MapItemType.Stair0, stair(0, true)],
  [MapItemType.Stair1, stair(-0.3)],
  [MapItemType.Stair2, stair(-0.6)],
  [MapItemType.Stair3, stair(-0.9)],
  [MapItemType.Stair4, stair(-1.2)],
  [MapItemType.Stair5, stair(-1.5)],
  [MapItemType.Stair6, stair(-1.8)],
  [MapItemType.Stair7, stair(-2.1)]
]);
