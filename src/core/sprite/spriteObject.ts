import type PlayerState from '../player/playerState';
import Texture from '../texture/texture';
import type { TextureType } from '../texture/textureStore';
import type { Vector3D } from '../types';
import type SpriteStore from './spriteStore';

export default class SpriteObject {
  position: Vector3D;
  width: number;
  height: number;
  textures: Texture[];
  timestamp: number;
  top: number;
  halfWidth: number;
  ratio!: number;

  public interaction?: (state: PlayerState, spriteStore: SpriteStore) => void;

  constructor(
    position: Vector3D,
    size: { width: number; height: number },
    textureTypes: TextureType[],
    repeat: number,
    interaction?: (state: PlayerState) => void
  ) {
    this.position = position;
    this.width = size.width;
    this.height = size.height;
    this.textures = textureTypes.map(t => new Texture(t, repeat));
    this.timestamp = 0;
    this.top = position.z + size.height;
    this.halfWidth = this.width / 2;
    this.interaction = interaction;
  }

  public setRatio(textureDataWidth: number): void {
    this.ratio = textureDataWidth / this.width;
  }
}
