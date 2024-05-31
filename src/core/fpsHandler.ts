import { mod } from '../core/exts';
import settings from './settings';

export class FpsHandler {
  private prevTimestamp = 0;
  private fps = 0;
  private context: CanvasRenderingContext2D;
  private fontSize: number;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.fontSize = settings.resolutionHeight * 0.04;
    context.font = `${this.fontSize}px Arial`;
    context.fillStyle = '#FF0000';
    context.textBaseline = 'top';
  }

  public handle(timestamp: number): void {
    if (mod(timestamp | 0, 4) === 0) {
      this.fps = (1000 / (timestamp - this.prevTimestamp)) | 0;
    }
    this.prevTimestamp = timestamp;
    const context = this.context;

    context.fillText(
      `${this.fps}`,
      settings.resolutionWidth - this.fontSize * 1.5,
      this.fontSize * 0.1
    );
  }
}
