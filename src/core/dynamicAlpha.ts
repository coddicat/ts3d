import settings from './settings';
import PlayerState from './player/playerState';
import RayHandler from './ray/rayHandler';

export default class DynamicAlpha {  
  private playerState: PlayerState;
  private rayHandlerState: RayHandler;

  constructor(playerState: PlayerState, rayHandlerState: RayHandler) {
    this.playerState = playerState;
    this.rayHandlerState = rayHandlerState;
  }

  public init(bottom: number): void {
    this.distanceRate =
      settings.resolution.width * (this.playerState.lookZ - bottom);    
  }

  public distanceRate = 0;
  public alpha = 0;
  public distance = 0;

  public setDistanceAlpha(y: number): void {
    const shift = y - this.playerState.halfLookVertical;
    if (!shift) {      
      this.alpha = 0;
      this.distance = settings.lookLength;
      return;
    }

    this.distance = this.distanceRate / shift;
    this.alpha = (settings.lookLength - this.distance) * this.rayHandlerState.alphaMaxLightFact;
  }
}
