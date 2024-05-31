import settings from '../settings';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import Ray from './ray';
import { RayAngle } from './rayAngle';
import RayHandler from './rayHandler';
import { mod } from '../exts';
import textureStore, { TextureType } from '../texture/textureStore';
import type { TextureData } from '../texture/textureData';
import type SpriteStore from '../sprite/spriteStore';

class RayCasting {
  private playerState: PlayerState;
  private rayHandler: RayHandler;
  private ray: Ray;

  private background?: TextureData;
  private backgroundWidth = 0;
  private backgroundRatio = 0;
  private backgroundOffsetStep = 0;

  public rayAngle: RayAngle;
  public displayX!: number;

  constructor(
    playerState: PlayerState,
    spriteStore: SpriteStore,
    gameMap: GameMap
  ) {
    this.playerState = playerState;

    this.rayAngle = new RayAngle(0, playerState);
    settings.data.fill(0);
    this.rayHandler = new RayHandler(playerState, spriteStore, this, gameMap);

    this.ray = new Ray(
      this.playerState.position,
      this.rayAngle,
      this.rayHandler
    );
  }

  public init() {
    //background sky
    this.background = textureStore.getTextureData(TextureType.Sky)!;
    this.backgroundWidth = this.background.width;
    this.backgroundRatio = this.backgroundWidth * settings.angleStep_pi2;
    this.backgroundOffsetStep = settings.angleStep_pi2 * this.backgroundWidth;
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

    const skyY = settings.maxLookVertical - this.playerState.lookVertical;

    let skyOffset = this.playerState.angle_pi2 * this.backgroundWidth;

    do {
      const angle =
        settings.angles[this.displayX] + this.playerState.position.angle;

      this.rayAngle.setAngle(angle);

      this.handleAngle();

      this.drawBackground(
        this.displayX,
        skyY,
        skyOffset,
        this.backgroundRatio,
        this.background!
      );

      this.displayX++;
      skyOffset += this.backgroundOffsetStep;

      this.rayHandler.reset();
    } while (this.displayX < settings.resolutionWidth);
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
