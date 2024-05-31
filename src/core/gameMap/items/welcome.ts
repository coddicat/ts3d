import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import { Wall, type MapItem } from '../../types';
import { roomHeight } from './basic';

export const welcomeWall = (
  repeatX: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    new Wall(
      roomHeight,
      0,
      new TextureSet(TextureType.Welcome, roomHeight, startX, startY, repeatX)
    )
  ],
  tiles: [],
  stopRay: true
});
