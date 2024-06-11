import settings from '../settings';
import type { TextureData } from '../texture/textureData';
import textureStore, { TextureType } from '../texture/textureStore';

export class AimHandler {
  private context: CanvasRenderingContext2D;
  private aim?: TextureData | null;
  private aimSize: number;
  private aimPosX: number;
  private aimPosY: number;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.aimSize = (settings.resolutionHeight / 20) | 0;
    this.aimPosX = settings.halfWidth - (this.aimSize >> 1);
    this.aimPosY = settings.halfHeight - (this.aimSize >> 1);
  }

  private getAim(): TextureData | null {
    if (this.aim) return this.aim;
    const texture = textureStore.getTextureData(TextureType.Aim);
    this.aim = texture;
    return this.aim;
  }

  public handle() {
    const texture = this.getAim();
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
