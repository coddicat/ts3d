import settings from '../settings';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import Ray from './ray';
import { RayAngle } from './rayAngle';
import RayHandler from './rayHandler';
import type SpriteObject from '../sprite/spriteObject';
import { mod } from '../exts';
import textureStore, { TextureType } from '../texture/textureStore';
import type { TextureData } from '../texture/textureData';

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

    //TODO extract and once calcualtion
    const textureData = textureStore.getTextureData(TextureType.Sky)!;
    const skyRatio = textureData.width * settings.angleStep_pi2;
    const skyOffsetStep = settings.angleStep_pi2 * textureData.width;
    const skyY = settings.maxLookVertical - this.playerState.lookVertical;

    let skyOffset = this.playerState.angle_pi2 * textureData.width;

    do {
      const angle =
        settings.angles[this.displayX] + this.playerState.position.angle;

      this.rayAngle.setAngle(angle);

      this.handleAngle();
      this.drawBackground(
        this.displayX,
        skyY,
        skyOffset,
        skyRatio,
        textureData
      );

      this.displayX++;
      skyOffset += skyOffsetStep;

      this.rayHandler.reset();
    } while (this.displayX < settings.resolutionWidth);

    this.imageData.data.set(settings.buf8);
  }

  private drawBackground(
    x: number,
    y: number,
    offset: number,
    ratio: number,
    textureData: TextureData
  ) {
    const spriteX = offset | 0;
    let top = 0;

    while (top <= settings.resolutionHeight - 1) {
      if (settings.data[x]) {
        top++;
        x += settings.resolutionWidth;
        y++;
        continue;
      }

      const index =
        Math.imul(mod((y * ratio) | 0, textureData.height), textureData.width) +
        spriteX;

      settings.data[x] = textureData.data[index];

      top++;
      x += settings.resolutionWidth;
      y++;
    }
  }
}

export default RayCasting;
