import Texture from '../../texture/texture';
import type { Level, MapItem, Wall } from '../../types';
import { TextureType } from '../../texture/textureStore';
import { roomFloor, basementFloor, roomCeil } from './basic';

function getShelfLevels(bottom: number): Level[] {
  return [
    {
      bottom,
      texture: new Texture(TextureType.FloorMetal)
    },
    {
      bottom: bottom - 0.2,
      texture: new Texture(TextureType.FloorMetal)
    }
  ];
}

function getShelfWall(bottom: number): Wall {
  return {
    top: bottom,
    bottom: bottom - 0.2,
    texture: new Texture(TextureType.Wood, 1)
  };
}

export const shelfsSpace: MapItem = {
  stopRay: false,
  walls: [getShelfWall(-0.6), getShelfWall(-1.2), getShelfWall(-1.8)],
  levels: [
    basementFloor,
    roomFloor,
    roomCeil,
    ...getShelfLevels(-0.6),
    ...getShelfLevels(-1.2),
    ...getShelfLevels(-1.8)
  ]
};
