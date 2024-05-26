import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { roomHeight } from './basic';

export default (repeatX: number, startX: number, startY: number): MapItem => ({
  walls: [
    {
      top: roomHeight,
      bottom: 0,
      texture: new TextureSet(
        TextureType.WelcomeWall,
        3.5,
        startX,
        startY,
        repeatX
      )
    }
  ],
  levels: [],
  stopRay: true
});
