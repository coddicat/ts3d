import Texture from '../../texture/texture';
import { Wall } from '../../types';
import type { Tile, MapItem } from '../../types';
import { TextureType } from '../../texture/textureStore';
import { roomFloor, basementFloor, roomCeil } from './basic';

function getShelfTiles(bottom: number): Tile[] {
  return [
    {
      bottom,
      texture: new Texture(TextureType.RoomFloor)
    },
    {
      bottom: bottom - 0.2,
      texture: new Texture(TextureType.RoomFloor)
    }
  ];
}

function getShelfWall(bottom: number): Wall {
  return new Wall(bottom, bottom - 0.2, new Texture(TextureType.Wood));
}

export const shelfsSpace: MapItem = {
  stopRay: false,
  walls: [getShelfWall(-0.6), getShelfWall(-1.2), getShelfWall(-1.8)],
  tiles: [
    basementFloor,
    roomFloor,
    roomCeil,
    ...getShelfTiles(-0.6),
    ...getShelfTiles(-1.2),
    ...getShelfTiles(-1.8)
  ]
};
