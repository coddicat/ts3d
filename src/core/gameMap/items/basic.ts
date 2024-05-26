import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';

export const roomCeil: Level = {
  bottom: 3.5,
  texture: new Texture(TextureType.Ceil, 1)
};

export const coridorCeil: Level = {
  bottom: 2.8,
  texture: new Texture(TextureType.Ceil, 1)
};

export const lowCoridorCeil: Level = {
  bottom: 2.5,
  texture: new Texture(TextureType.CoridorCeil, 1)
};

export const basementFloor: Level = {
  bottom: -2.4,
  texture: new Texture(TextureType.FloorBasement, 1)
};

export const coridorFloor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const floor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const woodFloorTop: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Wood, 1)
};
export const woodFloorBottom: Level = {
  bottom: -0.3,
  texture: new Texture(TextureType.Wood, 1)
};

export const floorNumber: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Numbers)
};
export const ceilNumber: Level = {
  bottom: 3.5,
  texture: new Texture(TextureType.Numbers, 1)
};

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
      top: 0,
      bottom: -0.3,
      texture: new Texture(TextureType.Wood, 1)
    }
  ],
  levels: [basementFloor, woodFloorBottom, woodFloorTop, roomCeil],
  stopRay: false
};

export const basementSpace: MapItem = {
  walls: [],
  levels: [basementFloor, roomCeil],
  stopRay: false
};
