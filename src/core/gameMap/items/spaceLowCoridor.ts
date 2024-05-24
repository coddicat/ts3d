// import TextureSet from '../../texture/textureSet';
// import { TextureType } from '../../texture/textureStore';
import { basementFloor, coridorFloor, lowCoridorCeil } from './basic';
import { getWall } from './wallMain';

export default (_: number, startX: number, startY: number) => ({
  walls: [getWall(startX, startY, 3.5, 2.5)],
  levels: [basementFloor, coridorFloor, lowCoridorCeil],
  stopRay: false
});
