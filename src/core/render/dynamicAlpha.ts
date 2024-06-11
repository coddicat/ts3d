import settings from '../settings';
import type PlayerState from '../player/playerState';
import type RayHandler from '../ray/rayHandler';

export default class DynamicAlpha {
  private playerState: PlayerState;
  private rayHandlerState: RayHandler;

  constructor(playerState: PlayerState, rayHandlerState: RayHandler) {
    this.playerState = playerState;
    this.rayHandlerState = rayHandlerState;
  }

  public init(bottom: number): void {
    this.distanceRatio =
      settings.resolutionHeight * (this.playerState.lookZ - bottom);
  }

  public distanceRatio = 0;
  public distance = 0;

  public setDistanceAlpha(y: number): number {
    const shift = y - this.playerState.halfLookVertical;
    if (!shift) {
      this.distance = settings.lookLength;
      return 0;
    }

    this.distance = this.distanceRatio / shift;
    return (
      (settings.lookLength - this.distance) *
      this.rayHandlerState.alphaMaxLightFact
    );
  }
}
