import { AimHandler } from './aimHandler';
import { FpsHandler } from './fpsHandler';
import type PlayerState from '../player/playerState';
import settings from '../settings';
import { TextHandler } from './textHandler';

export class CanvasHandler {
  private imageData: ImageData;
  private context: CanvasRenderingContext2D;
  private fpsHandler: FpsHandler;
  private aimHandler: AimHandler;
  private playerState: PlayerState;
  private textHandler: TextHandler;

  constructor(mainCanvas: HTMLCanvasElement, playerState: PlayerState) {
    this.playerState = playerState;
    mainCanvas.width = settings.resolutionWidth;
    mainCanvas.height = settings.resolutionHeight;

    const ctx = mainCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    if (!ctx) throw 'cannot get context';

    this.textHandler = new TextHandler(ctx);
    this.fpsHandler = new FpsHandler(this.textHandler);
    this.aimHandler = new AimHandler(ctx);
    this.context = ctx;

    this.imageData = ctx.createImageData(
      settings.resolutionWidth,
      settings.resolutionHeight
    );
  }

  private drawLife() {
    const context = this.context;
    const lifeLevel = this.playerState.life / 100;
    if (lifeLevel < 0.33) {
      context.fillStyle = '#FF0000CC';
    } else if (lifeLevel < 0.66) {
      context.fillStyle = '#FF6600CC';
    } else {
      context.fillStyle = '#0066FFCC';
    }

    //TODO
    context.strokeStyle = '#000';
    context.lineWidth = settings.resolutionHeight / 400;
    const height = settings.resolutionHeight / 25;
    const max = settings.resolutionHeight / 4;
    const padding = settings.resolutionHeight / 200;
    context.imageSmoothingEnabled = false;
    context.fillRect(padding, padding, max * lifeLevel, height);
    context.strokeRect(padding, padding, max, height);
    this.textHandler.print(
      'O2',
      max / 2 + padding,
      padding + height / 2 + context.lineWidth,
      '#FF0000',
      'center',
      'middle'
    );
  }

  private printPosition(): void {
    //TODO

    const z = ((this.playerState.position.z * 100) | 0) / 100;
    const x = ((this.playerState.position.x * 100) | 0) / 100;
    const y = ((this.playerState.position.y * 100) | 0) / 100;
    this.textHandler.print(
      `{${x};${y};${z}}`,
      0,
      settings.resolutionHeight,
      '#FF0000',
      'left',
      'bottom'
    );
  }

  public handle(timestamp: number) {
    this.imageData.data.set(settings.buf8);
    this.context.putImageData(this.imageData, 0, 0);
    this.fpsHandler.handle(timestamp);
    this.aimHandler.handle();

    this.printPosition();
    this.drawLife();
  }
}
