import type PlayerState from '../player/playerState';
import { TextureType } from '../texture/textureStore';
import type { Vector3D } from '../types';
import SpriteObject from './spriteObject';
import type SpriteStore from './spriteStore';

export class OxygenObject extends SpriteObject {
  public interaction = (state: PlayerState, spriteStore: SpriteStore) => {
    state.life = Math.min(100, state.life + 5);
    const index = spriteStore.spriteObjects.indexOf(this);
    if (index >= 0) {
      spriteStore.spriteObjects.splice(index, 1);
      setTimeout(() => {
        spriteStore.spriteObjects.push(this);
      }, 10000);
    }
  };

  constructor(position: Vector3D) {
    super(
      position,
      {
        height: 1,
        width: 0.3
      },
      [TextureType.Oxygen],
      1
    );
  }
}
