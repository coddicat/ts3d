import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem, Wall } from '../../types';

export const roomHeight = 3.5;
export const basementDepth = -2.4;
export const coridorHeight = 2.8;

export const roomCeil: Level = {
  bottom: roomHeight,
  texture: new Texture(TextureType.Ceil)
};
export const coridorCeil: Level = {
  bottom: coridorHeight,
  texture: new Texture(TextureType.Ceil)
};

export const basementFloor: Level = {
  bottom: basementDepth,
  texture: new Texture(TextureType.FloorBasement)
};

export const coridorFloor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal, 1)
};

export const floor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal)
};

export const woodFloorTop: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Wood)
};
export const woodFloorBottom: Level = {
  bottom: -0.3,
  texture: new Texture(TextureType.Wood)
};

export const floorNumber: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Numbers)
};
export const ceilNumber: Level = {
  bottom: roomHeight,
  texture: new Texture(TextureType.Numbers)
};

export const basementWall: Wall = {
  top: 0,
  bottom: basementDepth,
  texture: new Texture(TextureType.WallBasement, 2.4)
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
