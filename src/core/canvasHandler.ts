import settings from './settings';
import textureStore, { TextureType } from './texture/textureStore';

export class CanvasHandler {
  private imageData: ImageData;
  private context: CanvasRenderingContext2D;

  constructor(mainCanvas: HTMLCanvasElement) {
    mainCanvas.width = settings.resolutionWidth;
    mainCanvas.height = settings.resolutionHeight;

    const ctx = mainCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    if (!ctx) throw 'cannot get context';
    this.context = ctx;
    this.imageData = ctx.createImageData(
      settings.resolutionWidth,
      settings.resolutionHeight
    );
  }

  public handle() {
    this.imageData.data.set(settings.buf8);
    this.context.putImageData(this.imageData, 0, 0);

    //TODO change to draw lines
    const texture = textureStore.getTextureData(TextureType.Aim);
    this.context.drawImage(
      texture!.canvas,
      settings.halfWidth - texture!.width / 2,
      settings.halfHeight - texture!.height / 2
    );

    this.context.restore();
  }
}
