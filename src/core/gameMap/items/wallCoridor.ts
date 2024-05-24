import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import { basementWall } from './wallMain';

export default (_: number, startX: number, startY: number) => ({
  walls: [
    basementWall,
    {
      color: 0xc8c8dc,
      top: 2.8,
      bottom: 0,
      render: true,
      texture: new TextureSet(
        TextureType.WallCoridor,
        2.8,
        startX,
        startY,
        5,
        false
      )
    }
  ],
  levels: [],
  stopRay: false
});
