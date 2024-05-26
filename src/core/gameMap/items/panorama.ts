import { basementWall, getWall as getMainWall } from './wallMain';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';

export default (_: number, startX: number, startY: number) => ({
  walls: [
    {
      color: 0xc8c8dc,
      top: 2.8,
      bottom: 0.5,
      render: true,
      texture: new TextureSet(
        TextureType.Window,
        2.3,
        startX,
        startY,
        2,
        false,
        true
      )
    },
    getMainWall(startX, startY, 3.5, 2.8, false),
    getMainWall(startX, startY, 0.5, 0, true),
    basementWall
  ],
  levels: [],
  stopRay: false,
  transparent: 0.6
});
