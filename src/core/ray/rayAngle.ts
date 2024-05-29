import { sign } from '../exts';
import type PlayerState from '../player/playerState';

const rad90 = Math.PI / 2;

export class RayAngle {
  public angle!: number;
  public cos!: number;
  public sin!: number;
  public tan90!: number;
  public spriteFact!: number;
  public cosSign!: number;
  public sinSign!: number;
  public cosAbs!: number;
  public sinAbs!: number;

  public revertCos!: number;
  public revertSin!: number;
  public revertCosAbs!: number;
  public revertSinAbs!: number;

  public fixCos!: number;
  public fixSin!: number;
  public fixCosAbs!: number;
  public fixSinAbs!: number;

  public fixDistance!: number;
  public timestamp: number;

  private playerState?: PlayerState;

  constructor(angle: number, playerState?: PlayerState) {
    this.playerState = playerState;
    this.timestamp = 0;
    this.setAngle(angle);
  }

  public setAngle(angle: number): void {
    this.angle = angle;
    this.setAngleProps(true);
  }

  private setAngleProps(calcFixDistance: boolean): void {
    this.cos = Math.cos(this.angle);
    this.sin = Math.sin(this.angle);

    this.revertCos = 1 / this.cos;
    this.revertSin = 1 / this.sin;

    this.tan90 = Math.tan(this.angle + rad90);
    this.cosSign = sign(this.cos);
    this.sinSign = sign(this.sin);
    this.cosAbs = this.cos * this.cosSign;
    this.sinAbs = this.sin * this.sinSign;

    this.revertCosAbs = this.revertCos * this.cosSign;
    this.revertSinAbs = this.revertSin * this.sinSign;

    this.spriteFact = this.sin - this.cos * this.tan90;

    if (calcFixDistance && this.playerState != undefined) {
      this.fixDistance =
        this.cos * this.playerState.cos + this.sin * this.playerState.sin;
    } else if (calcFixDistance) {
      this.fixDistance = 1;
    }

    this.fixCosAbs = this.cosAbs / this.fixDistance;
    this.fixSinAbs = this.sinAbs / this.fixDistance;
    this.fixCos = this.cos / this.fixDistance;
    this.fixSin = this.sin / this.fixDistance;

    this.timestamp++;
  }

  public mirrorX() {
    this.angle *= -1;
    this.setAngleProps(false);
  }

  public mirrorY() {
    this.angle = Math.PI - this.angle;
    this.setAngleProps(false);
  }
}
