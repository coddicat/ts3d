import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { Level, MapItem } from '../../types';
import { basementFloor, roomCeil } from './basic';

const bridgeBottom = -0.3;

export const bridgeFloorTop: Level = {
  bottom: 0,
  texture: new Texture(TextureType.Wood)
};
export const bridgeFloorBottom: Level = {
  bottom: bridgeBottom,
  texture: new Texture(TextureType.Wood)
};

export const bridgeSpace: MapItem = {
  walls: [
    {
      top: 0,
      bottom: bridgeBottom,
      texture: new Texture(TextureType.Wood)
    }
  ],
  levels: [basementFloor, bridgeFloorBottom, bridgeFloorTop, roomCeil],
  stopRay: false
};
