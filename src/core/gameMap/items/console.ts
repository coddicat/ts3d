import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem, Wall } from '../../types';
import { MapItemType } from '../mapItemType';
import { roomCeil, roomFloor } from './basic';

const height = 0.6;
const depth = 0.25;

const wall: Wall = {
  bottom: height - depth,
  top: height,
  texture: new Texture(TextureType.RoomWall)
};

const getItem = (texture: TextureType): MapItem => ({
  walls: [wall],
  tiles: [
    roomFloor,
    roomCeil,
    {
      bottom: height,
      texture: new Texture(texture)
    }
  ],
  stopRay: false
});

export const console = new Map<MapItemType, MapItem>([
  [MapItemType.ConsoleSpace11, getItem(TextureType.Console11)],
  [MapItemType.ConsoleSpace12, getItem(TextureType.Console12)],
  [MapItemType.ConsoleSpace13, getItem(TextureType.Console13)],
  [MapItemType.ConsoleSpace21, getItem(TextureType.Console21)],
  [MapItemType.ConsoleSpace22, getItem(TextureType.Console22)],
  [MapItemType.ConsoleSpace23, getItem(TextureType.Console23)]
]);
