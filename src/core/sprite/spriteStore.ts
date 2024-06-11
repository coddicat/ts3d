import type PlayerState from '../player/playerState';
import SpriteObject from './spriteObject';
import textureStore, { TextureType } from '../texture/textureStore';
import { OxygenObject } from './oxygenObject';

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

function getOxygen(x: number, y: number, z: number = 0) {
  return new OxygenObject({
    x: x,
    y: y,
    z: z,
    angle: 0
  });
}

const sprites = [
  getOxygen(25, 70.7),
  getOxygen(25.5, 77.5),
  getOxygen(30.5, 80.5),
  getOxygen(26.5, 73.5, -2.4),
  getOxygen(34.5, 59.5, 0),
  getOxygen(19.5, 60.5, 0),
  getOxygen(17.5, 39.5, 0),
  getOxygen(5.5, 58.5, 0),
  getOxygen(16.5, 47.5, 0),

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
          sprite.setRatio(data.width);
        }
      });
    });
  }

  public spriteObjects!: SpriteObject[];
}
