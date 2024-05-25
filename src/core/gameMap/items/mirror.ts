import { basementWall, getWall as getMainWall } from './wallMain';

export default (_: number, startX: number, startY: number) => ({
  walls: [
    getMainWall(startX, startY, 3.5, 2.8, false),
    getMainWall(startX, startY, 0.5, 0, true),
    basementWall,
    //collision
    {
      color: 0,
      top: 3.5,
      bottom: 0,
      render: false,
      texture: null
    }
  ],
  levels: [],
  stopRay: true,
  mirror: true
});
