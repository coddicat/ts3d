import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { Tile, MapItem, Wall } from '../../types';

export const basementDepth = -2.4;
export const roomHeight = 3.5;

export const roomFloor: Tile = {
  bottom: 0,
  texture: new Texture(TextureType.RoomFloor)
};

export const roomCeil: Tile = {
  bottom: roomHeight,
  texture: new Texture(TextureType.RoomCeil)
};

export const basementFloor: Tile = {
  bottom: basementDepth,
  texture: new Texture(TextureType.BasementFloor)
};

export const getBasementWall = (startX: number, startY: number): Wall => ({
  top: 0,
  bottom: basementDepth,
  texture: new TextureSet(
    TextureType.BasementWall,
    -basementDepth,
    startX,
    startY,
    2
  )
});

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
    TextureType.RoomWall,
    roomHeight,
    startX,
    startY,
    4,
    revert
  )
});

export const roomWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getRoomWall(startX, startY, roomHeight, 0),
    getBasementWall(startX, startY)
  ],
  tiles: [],
  stopRay: true
});

export const emptyItem: MapItem = {
  walls: [],
  tiles: [],
  stopRay: false
};

export const outmapItem: MapItem = {
  walls: [],
  tiles: [],
  stopRay: true
};

export const roomSpace: MapItem = {
  walls: [],
  tiles: [basementFloor, roomFloor, roomCeil],
  stopRay: false
};

export const basementSpace: MapItem = {
  walls: [],
  tiles: [basementFloor, roomCeil],
  stopRay: false
};
