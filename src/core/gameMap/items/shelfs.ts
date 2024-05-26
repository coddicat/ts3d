import Texture from '../../texture/texture';
import type { Level, Wall } from '../../types';
import { basementFloor, floor, roomCeil } from './basic';
import { TextureType } from '../../texture/textureStore';

function shelfLevels(bottom: number): Level[] {
  return [
    {
      bottom,
      texture: new Texture(TextureType.FloorMetal, 1)
    },
    {
      bottom: bottom - 0.2,
      texture: new Texture(TextureType.FloorMetal, 1)
    }
  ];
}

function shelfWall(bottom: number): Wall {
  return {
    top: bottom,
    bottom: bottom - 0.2,
    texture: new Texture(TextureType.Wood, 1)
  };
}

export default {
  stopRay: false,
  walls: [shelfWall(-0.6), shelfWall(-1.2), shelfWall(-1.8)],
  levels: [
    basementFloor,
    floor,
    roomCeil,
    ...shelfLevels(-0.6),
    ...shelfLevels(-1.2),
    ...shelfLevels(-1.8)
  ]
};
