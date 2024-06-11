import { mod } from '../exts';
import settings from '../settings';
import type { TextHandler } from './textHandler';

export class FpsHandler {
  private prevTimestamp = 0;
  private fps = 0;
  private textHandler: TextHandler;

  constructor(textHandler: TextHandler) {
    this.textHandler = textHandler;
  }

  public handle(timestamp: number): void {
    if (mod(timestamp | 0, 4) === 0) {
      this.fps = (1000 / (timestamp - this.prevTimestamp)) | 0;
    }
    this.prevTimestamp = timestamp;
    this.textHandler.print(
      `${this.fps}`,
      settings.resolutionWidth,
      0,
      '#FF0000',
      'right'
    );
  }
}
