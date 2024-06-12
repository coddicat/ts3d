import type PlayerState from '../player/playerState';
import settings from '../settings';

export class MouseHandler {
  private playerState: PlayerState;

  constructor(playerState: PlayerState) {
    this.playerState = playerState;
  }

  public handler(movementX: number, movementY: number) {
    this.playerState.setAngle(
      this.playerState.position.angle + settings.turnSpeed * movementX
    );

    const max = settings.maxLookVertical;
    const newLookVertical = this.playerState.lookVertical - movementY;

    this.playerState.lookVertical = Math.max(
      -max,
      Math.min(max, newLookVertical)
    );

    this.playerState.halfLookVertical =
      settings.halfHeight + this.playerState.lookVertical;
  }
}
