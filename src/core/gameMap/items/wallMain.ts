import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';

export const getWall = (
  startX: number,
  startY: number,
  top: number,
  bottom: number,
  revert: boolean = false
) => ({
  color: 0xc8c8dc,
  top,
  bottom,
  render: true,
  texture: new TextureSet(TextureType.WallMain, 3.5, startX, startY, 2, revert)
});

export const basementWall = {
  color: 0xc8c8dc,
  top: 0,
  bottom: -2.4,
  render: true,
  texture: new Texture(TextureType.WallBasement, 2.4)
};

export default (_: number, startX: number, startY: number) => ({
  walls: [getWall(startX, startY, 3.5, 0, false), basementWall],
  levels: [],
  stopRay: true
});
