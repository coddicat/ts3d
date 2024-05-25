import settings from '../settings';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import Ray from './ray';
import { RayAngle } from './rayAngle';
import RayHandler from './rayHandler';
import type SpriteObject from '../sprite/spriteObject';
import { mod } from '../exts';
import textureStore, { TextureType } from '../texture/textureStore';

const PI2 = Math.PI * 2;

class RayCasting {
  private imageData: ImageData;
  private playerState: PlayerState;
  private rayHandler: RayHandler;
  private ray: Ray;

  public rayAngle: RayAngle;
  public displayX!: number;

  constructor(
    imageData: ImageData,
    playerState: PlayerState,
    spriteObjects: SpriteObject[],
    gameMap: GameMap
  ) {
    this.imageData = imageData;
    this.playerState = playerState;

    this.rayAngle = new RayAngle(0, playerState);
    settings.data.fill(0);
    this.rayHandler = new RayHandler(playerState, spriteObjects, this, gameMap);

    this.ray = new Ray(
      this.playerState.position,
      this.rayAngle,
      this.rayHandler
    );
  }

  public reset(): void {
    settings.data.fill(0);
  }

  private handleAngle(): void {
    this.ray.init();
    this.ray.send(settings.lookLength / this.rayAngle.fixDistance);
  }

  public draw3D(): void {
    this.displayX = 0;

    do {
      const angle =
        settings.angles[this.displayX] + this.playerState.position.angle;

      this.rayAngle.setAngle(angle);

      this.handleAngle();
      this.drawSky(this.displayX);

      this.displayX++;
      this.rayHandler.reset();
    } while (this.displayX < settings.resolution.width);

    this.imageData.data.set(settings.buf8);
  }

  private drawSky(displayX: number) {
    const textureData = textureStore.getTextureData(TextureType.Sky)!;
    const yRate =
      textureData.width /
      ((PI2 / settings.lookAngle) * settings.resolution.width);

    const offset =
      (this.playerState.position.angle +
        displayX * (settings.lookAngle / settings.resolution.width)) /
      PI2;

    const spriteX = (offset * textureData.width) | 0;

    let spriteY = settings.maxLookVertical - this.playerState.lookVertical;
    let top = 0;
    let dataIndex = Math.imul(top, settings.resolution.width) + displayX;

    while (top <= settings.resolution.height - 1) {
      if (settings.data[dataIndex]) {
        top++;
        dataIndex += settings.resolution.width;
        spriteY++;
        continue;
      }

      const index =
        Math.imul(
          mod((spriteY * yRate) | 0, textureData.height),
          textureData.width
        ) + spriteX;

      const pixel = textureData.data[index];

      settings.data[dataIndex] = pixel;

      top++;
      dataIndex += settings.resolution.width;
      spriteY++;
    }
  }
}

export default RayCasting;
