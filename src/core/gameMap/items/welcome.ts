import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { roomHeight } from './basic';

export const welcomeWall = (
  repeatX: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    {
      top: roomHeight,
      bottom: 0,
      texture: new TextureSet(
        TextureType.Welcome,
        roomHeight,
        startX,
        startY,
        repeatX
      )
    }
  ],
  tiles: [],
  stopRay: true
});
