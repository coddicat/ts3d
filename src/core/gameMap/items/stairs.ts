import { TextureType } from '../../texture/textureStore';
import { Wall } from '../../types';
import type { Tile, MapItem } from '../../types';
import { MapItemType } from '../mapItemType';
import Texture from '../../texture/texture';
import { basementFloor, roomCeil } from './basic';

const stairDepth = 0.3;

function getStairSpace(top: number, wood: boolean = false): MapItem {
  const bottom = (((top - stairDepth) * 1000) | 0) / 1000;
  const texture = wood
    ? new Texture(TextureType.Wood, 1)
    : new Texture(TextureType.Parquet, 1);

  const walls: Wall[] = [new Wall(top, bottom, texture)];

  const tileTop: Tile = {
    bottom: top,
    texture: texture
  };

  const tileBottom: Tile = {
    bottom: bottom,
    texture: texture
  };

  const tiles: Tile[] = [basementFloor, tileBottom, tileTop, roomCeil];

  return {
    walls,
    tiles,
    stopRay: false
  };
}

export const stairs = new Map<MapItemType, MapItem>([
  [MapItemType.StairSpace0, getStairSpace(0, true)],
  [MapItemType.StairSpace1, getStairSpace(-stairDepth * 1)],
  [MapItemType.StairSpace2, getStairSpace(-stairDepth * 2)],
  [MapItemType.StairSpace3, getStairSpace(-stairDepth * 3)],
  [MapItemType.StairSpace4, getStairSpace(-stairDepth * 4)],
  [MapItemType.StairSpace5, getStairSpace(-stairDepth * 5)],
  [MapItemType.StairSpace6, getStairSpace(-stairDepth * 6)],
  [MapItemType.StairSpace7, getStairSpace(-stairDepth * 7)]
]);
