import type PlayerState from '../player/playerState';
import SpriteObject from './spriteObject';
import textureStore, { TextureType } from '../texture/textureStore';

function getBanan(x: number, y: number, z: number): SpriteObject {
  return new SpriteObject(
    {
      x,
      y,
      z,
      angle: 0
    },
    {
      height: 0.5,
      width: 0.5
    },
    [TextureType.Banan],
    1
  );
}

const sprites = [
  // new SpriteObject(
  //   {
  //     x: 0,
  //     y: 84,
  //     z: 0,
  //     angle: 0
  //   },
  //   {
  //     height: 1080,
  //     width: 1920
  //   },
  //   [TextureType.Sky],
  //   1
  // ),
  // new SpriteObject(
  //   {
  //     x: 30,
  //     y: 5,
  //     z: 0,
  //     angle: 0
  //   },
  //   {
  //     height: 1.8,
  //     width: 1.34
  //   },
  //   [TextureType.DukeFront, TextureType.DukeBack, TextureType.DukeSide],
  //   1
  // ),
  getBanan(29.5, 73.5, -0.6),
  getBanan(29.5, 73.5, -1.2),
  getBanan(29.5, 73.5, -1.8)
];

export default class SpriteStore {
  private playerState: PlayerState;
  constructor(playerState: PlayerState) {
    this.playerState = playerState;
  }
  public async init(): Promise<void> {
    this.spriteObjects = [this.playerState, ...sprites];

    this.spriteObjects.forEach(sprite => {
      sprite.textures.forEach(texture => {
        const data = textureStore.getTextureData(texture.type);
        if (data) {
          texture.setData(data);
          sprite.setRatio(texture.type, data.width);
        }
      });
    });
  }

  public spriteObjects!: SpriteObject[];
}
