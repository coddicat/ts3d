import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';
import {
  getRoomWall,
  roomFloor,
  roomHeight,
  basementFloor,
  basementWall
} from './basic';

export const coridorHeight = 2.8;

export const coridorCeil: Level = {
  bottom: coridorHeight,
  texture: new Texture(TextureType.Ceil)
};

export const coridorFloor: Level = {
  bottom: 0,
  texture: new Texture(TextureType.FloorMetal)
};

export const coridorSpace = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [getRoomWall(startX, startY, roomHeight, coridorHeight)],
  levels: [basementFloor, roomFloor, coridorCeil],
  stopRay: false
});

export const coridorWall = (
  _: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    basementWall,
    {
      top: coridorHeight,
      bottom: 0,
      texture: new TextureSet(
        TextureType.WallCoridor,
        coridorHeight,
        startX,
        startY,
        5
      )
    }
  ],
  levels: [],
  stopRay: true
});
