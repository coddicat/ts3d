import type { TextureData } from './textureData';
import type { TextureType } from './textureStore';

export default class Texture {
  constructor(
    type: TextureType,
    repeat: number = 1,
    transparent = false,
    revert = false
  ) {
    this.type = type;
    this.repeat = repeat;
    this.transparent = transparent;
    this.revert = revert;
  }

  public type: TextureType;
  public repeat: number;
  public revert?: boolean;
  public repeatX?: number;
  public startX?: number;
  public startY?: number;
  public data?: TextureData;
  public transparent: boolean;

  public setData(data: TextureData): void {
    this.data = data;
  }
}
