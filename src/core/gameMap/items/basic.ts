import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem, Wall } from '../../types';

export const basementDepth = -2.4;
export const roomHeight = 3.5;

export const roomFloor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal)
};

export const roomCeil: Level = {
  bottom: roomHeight,
  texture: new Texture(TextureType.Ceil)
};

export const basementFloor: Level = {
  bottom: basementDepth,
  texture: new Texture(TextureType.FloorBasement)
};

export const basementWall: Wall = {
  top: 0,
  bottom: basementDepth,
  texture: new Texture(TextureType.WallBasement, -basementDepth)
};

export const getRoomWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
): Wall => ({
  top,
  bottom,
  texture: new TextureSet(
    TextureType.WallMain,
    roomHeight,
    startX,
    startY,
    2,
    revert
  )
});

export const roomWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getRoomWall(startX, startY, roomHeight, 0), basementWall],
  levels: [],
  stopRay: true
});

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

export const roomSpace: MapItem = {
  walls: [],
  levels: [basementFloor, roomFloor, roomCeil],
  stopRay: false
};

export const basementSpace: MapItem = {
  walls: [],
  levels: [basementFloor, roomCeil],
  stopRay: false
};
