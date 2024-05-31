import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import { type Tile, type MapItem, Wall } from '../../types';
import { basementFloor, roomCeil } from './basic';

const bridgeBottom = -0.3;

export const bridgeFloorTop: Tile = {
  bottom: 0,
  texture: new Texture(TextureType.Wood)
};
export const bridgeFloorBottom: Tile = {
  bottom: bridgeBottom,
  texture: new Texture(TextureType.Wood)
};

export const bridgeSpace: MapItem = {
  walls: [new Wall(0, bridgeBottom, new Texture(TextureType.Wood))],
  tiles: [basementFloor, bridgeFloorBottom, bridgeFloorTop, roomCeil],
  stopRay: false
};
