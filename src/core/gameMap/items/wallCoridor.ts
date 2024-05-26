import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { basementWall, coridorHeight } from './basic';

export default (_: number, startX: number, startY: number): MapItem => ({
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
