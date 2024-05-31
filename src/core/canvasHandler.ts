import { FpsHandler } from './fpsHandler';
import settings from './settings';
import type { TextureData } from './texture/textureData';
import textureStore, { TextureType } from './texture/textureStore';

export class CanvasHandler {
  private imageData: ImageData;
  private context: CanvasRenderingContext2D;
  private fpsHandler: FpsHandler;
  private aim?: TextureData;
  private aimSize: number;
  private aimPosX: number;
  private aimPosY: number;

  constructor(mainCanvas: HTMLCanvasElement) {
    mainCanvas.width = settings.resolutionWidth;
    mainCanvas.height = settings.resolutionHeight;

    const ctx = mainCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    if (!ctx) throw 'cannot get context';

    this.fpsHandler = new FpsHandler(ctx);
    this.context = ctx;
    this.imageData = ctx.createImageData(
      settings.resolutionWidth,
      settings.resolutionHeight
    );
    this.aimSize = (settings.resolutionHeight / 20) | 0;
    this.aimPosX = settings.halfWidth - (this.aimSize >> 1);
    this.aimPosY = settings.halfHeight - (this.aimSize >> 1);
  }

  public handle(timestamp: number) {
    this.imageData.data.set(settings.buf8);
    this.context.putImageData(this.imageData, 0, 0);
    this.fpsHandler.handle(timestamp);

    const texture = this.aim ?? textureStore.getTextureData(TextureType.Aim);
    if (!texture) return;

    this.context.drawImage(
      texture.canvas,
      this.aimPosX,
      this.aimPosY,
      this.aimSize,
      this.aimSize
    );
  }
}
