import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { Tile, MapItem } from '../../types';
import {
  getRoomWall,
  roomFloor,
  roomHeight,
  basementFloor,
  getBasementWall
} from './basic';

export const coridorHeight = 2.8;

export const coridorCeil: Tile = {
  bottom: coridorHeight,
  texture: new Texture(TextureType.RoomCeil)
};

export const coridorFloor: Tile = {
  bottom: 0,
  texture: new Texture(TextureType.RoomFloor)
};

export const coridorSpace = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getRoomWall(startX, startY, roomHeight, coridorHeight)],
  tiles: [basementFloor, roomFloor, coridorCeil],
  stopRay: false
});

export const coridorWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getBasementWall(startX, startY),
    {
      top: coridorHeight,
      bottom: 0,
      texture: new TextureSet(
        TextureType.CoridorWall,
        coridorHeight,
        startX,
        startY,
        5
      )
    }
  ],
  tiles: [],
  stopRay: true
});
