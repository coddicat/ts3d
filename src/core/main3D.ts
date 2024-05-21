import settings from './settings';
import type { GameMap } from './gameMap/gameMap';
import type PlayerState from './player/playerState';
import RayCasting from './ray/rayCasting';
import type SpriteStore from './sprite/spriteStore';
import textureStore, { TextureType } from './texture/textureStore';

export class Main3D {
  private interCtx!: CanvasRenderingContext2D;
  private interCanvas!: HTMLCanvasElement;
  private imageData!: ImageData;
  private context!: CanvasRenderingContext2D;
  private rayCasting!: RayCasting;
  private playerState: PlayerState;
  private gameMap: GameMap;
  private spriteStore: SpriteStore;

  constructor(
    playerState: PlayerState,
    gameMap: GameMap,
    spriteStore: SpriteStore
  ) {
    this.playerState = playerState;
    this.gameMap = gameMap;
    this.spriteStore = spriteStore;
  }

  public init(mainCanvas: HTMLCanvasElement): void {
    this.interCanvas = document.createElement('canvas') as HTMLCanvasElement;
    this.interCanvas.width = settings.resolution.width;
    this.interCanvas.height = settings.resolution.height;
    const interCtx = this.interCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    if (!interCtx) throw 'Cannot get context';
    this.interCtx = interCtx;
    this.imageData = interCtx.createImageData(
      settings.resolution.width,
      settings.resolution.height
    );

    const ctx = mainCanvas.getContext('2d', {
      alpha: false,
      willReadFrequently: true
    });
    if (!ctx) throw 'cannot get context';
    this.context = ctx;

    this.rayCasting = new RayCasting(
      this.imageData,
      this.playerState,
      this.spriteStore.spriteObjects,
      this.gameMap
    );
  }

  public renderMain() {
    this.rayCasting.reset();

    this.rayCasting.draw3D();
    this.interCtx.putImageData(this.imageData, 0, 0);
    this.context.save();
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.scale(
      //TODO onetime calculation
      this.context.canvas.width / settings.resolution.width,
      this.context.canvas.height / settings.resolution.height
    );
    this.context.drawImage(this.interCanvas, 0, 0);

    //TODO change to draw lines
    const texture = textureStore.getTextureData(TextureType.Aim);
    this.context.drawImage(
      texture!.canvas,
      settings.resolution.width / 2 - texture!.width / 2,
      settings.resolution.height / 2 - texture!.height / 2
    );

    this.context.restore();
  }
}
