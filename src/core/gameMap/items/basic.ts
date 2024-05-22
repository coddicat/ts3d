import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';

export const roomCeil: Level = {
  color: 0xdcb9ac,
  bottom: 4,
  texture: new Texture(TextureType.Ceil, 1)
};

export const coridorCeil: Level = {
  color: 0xdcb9ac,
  bottom: 2.8,
  texture: new Texture(TextureType.Ceil, 1)
};

export const lowCoridorCeil: Level = {
  color: 0xdcb9ac,
  bottom: 2.5,
  texture: new Texture(TextureType.CoridorCeil, 1)
};

export const coridorFloor: Level = {
  color: 0xc8c8dc,
  bottom: 0.2,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const floor: Level = {
  color: 0xc8c8dc,
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

// export const towerFloor: Level = {
//   color: 0xc8c8dc,
//   bottom: 0,
//   texture: new Texture(TextureType.Ground, 1)
// };

// export const floorEmpty: Level = {
//   color: 0xc8c8dc,
//   bottom: 0,
//   texture: new Texture(TextureType.Sand, 1)
// };

export const floorNumber: Level = {
  color: 0xa8ff00,
  bottom: 0,
  texture: new Texture(TextureType.Numbers, 1)
};
export const ceilNumber: Level = {
  color: 0xa8ff00,
  bottom: 4,
  texture: new Texture(TextureType.Numbers, 1)
};

// export const roomSpaceItem: MapItem = {
//   walls: [],
//   levels: [floor, ceil],
//   stopRay: false
// };

export const emptyItem: MapItem = {
  walls: [],
  levels: [],
  stopRay: false
};

export const numberItem: MapItem = {
  walls: [],
  levels: [floorNumber, ceilNumber],
  stopRay: false
};

export const roomItem: MapItem = {
  walls: [],
  levels: [floor, roomCeil],
  stopRay: false
};

export const coridor: MapItem = {
  walls: [
    {
      color: 0xffffff,
      top: 4,
      bottom: 2.8,
      render: true,
      texture: new Texture(TextureType.WallMetal, 1)
    }
  ],
  levels: [floor, coridorCeil],
  stopRay: false
};

export const lowCoridor: MapItem = {
  walls: [
    {
      color: 0xffffff,
      top: 4,
      bottom: 2.5,
      render: true,
      texture: new Texture(TextureType.WallMetal, 1)
    },
    {
      color: 0xffffff,
      top: 0.2,
      bottom: 0,
      render: true,
      texture: new Texture(TextureType.FloorMetal, 1)
    }
  ],
  levels: [coridorFloor, lowCoridorCeil],
  stopRay: false
};
