import { mod } from '../core/exts';

export class FpsHandler {
  private prevTimestamp = 0;
  private fps = 0;

  public getFps(timestamp: number): number {
    if (mod(timestamp | 0, 4) === 0) {
      this.fps = (1000 / (timestamp - this.prevTimestamp)) | 0;
    }
    this.prevTimestamp = timestamp;
    return this.fps;
  }
}
