import type { RayAngle } from './rayAngle';
import type { Position2D } from '../types';
import { Axis } from '../types';

export default class RayAxis {
  public cellIndex!: number;
  public distance!: number;
  public sign!: number;
  public from!: number;

  private position: Position2D;
  private rayAngle: RayAngle;
  private axis: Axis;
  private step!: number;

  constructor(position: Position2D, rayAngle: RayAngle, axis: Axis) {
    this.position = position;
    this.rayAngle = rayAngle;
    this.axis = axis;
  }

  public init(): void {
    if (this.axis === Axis.x) {
      this.from = this.position.x;
      this.sign = this.rayAngle.cosSign;
      this.step = this.rayAngle.revertCosAbs;
    } else {
      this.from = this.position.y;
      this.sign = this.rayAngle.sinSign;
      this.step = this.rayAngle.revertSinAbs;
    }

    this.cellIndex = this.from | 0;

    let shift = this.from - this.cellIndex;
    if (this.sign >= 0) shift = 1 - shift;

    this.distance = this.step * shift;
  }

  public nextStep(): number {
    const prevDistance = this.distance;
    this.cellIndex += this.sign;
    this.distance += this.step;
    return prevDistance;
  }

  public mirror(): void {
    this.sign = -this.sign;
    this.distance -= this.step;
  }
}
