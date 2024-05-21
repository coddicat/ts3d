import Texture from './texture';
import type { TextureType } from './textureStore';

export default class TextureSet extends Texture {
  constructor(
    type: TextureType,
    repeat: number,
    startX: number,
    startY: number,
    repeatX: number,
    revert: boolean
  ) {
    super(type, repeat);
    this.startX = startX;
    this.startY = startY;
    this.repeatX = repeatX;
    this.revert = revert;
  }
}
