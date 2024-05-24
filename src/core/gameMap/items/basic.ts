import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';
//import { basementWall } from './wallMain';

export const roomCeil: Level = {
  color: 0xdcb9ac,
  bottom: 3.5,
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

export const basementFloor: Level = {
  color: 0xc8c8dc,
  bottom: -2.4,
  texture: new Texture(TextureType.FloorBasement, 1)
};

export const coridorFloor: Level = {
  color: 0xc8c8dc,
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const floor: Level = {
  color: 0xc8c8dc,
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const woodFloorTop: Level = {
  color: 0xc8c8dc,
  bottom: 0,
  texture: new Texture(TextureType.Wood, 1)
};
export const woodFloorBottom: Level = {
  color: 0xc8c8dc,
  bottom: -0.3,
  texture: new Texture(TextureType.Wood, 1)
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
  bottom: 3.5,
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

export const outmapItem: MapItem = {
  walls: [],
  levels: [],
  stopRay: true
};

export const numberItem: MapItem = {
  walls: [],
  levels: [basementFloor, floorNumber, ceilNumber],
  stopRay: false
};

export const roomItem: MapItem = {
  walls: [],
  levels: [basementFloor, floor, roomCeil],
  stopRay: false
};

export const bridgeItem: MapItem = {
  walls: [
    {
      color: 0xffffff,
      top: 0,
      bottom: -0.3,
      render: true,
      texture: new Texture(TextureType.Wood, 1)
    }
  ],
  levels: [basementFloor, woodFloorBottom, woodFloorTop, roomCeil],
  stopRay: false
};

// export const coridor: MapItem = {
//   walls: [
//     {
//       color: 0xffffff,
//       top: 3.5,
//       bottom: 2.8,
//       render: true,
//       texture: new Texture(TextureType.WallMetal, 1)
//     },
//     basementWall
//   ],
//   levels: [floor, coridorCeil],
//   stopRay: false
// };

export const basementSpace: MapItem = {
  walls: [],
  levels: [basementFloor, roomCeil],
  stopRay: false
};

// export const lowCoridor: MapItem = {
//   walls: [
//     {
//       color: 0xffffff,
//       top: 3.5,
//       bottom: 2.5,
//       render: true,
//       texture: new Texture(TextureType.WallMetal, 1)
//     }
//   ],
//   levels: [coridorFloor, lowCoridorCeil],
//   stopRay: false
// };
