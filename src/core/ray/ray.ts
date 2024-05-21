import Painter from '../render/painter';
import type { RayAngle } from '../ray/rayAngle';
import RayAxis from '../ray/rayAxis';
import type { CellHandler } from '../ray/rayHandler';
import type { Position2D } from '../types';
import { RayAction, Axis } from '../types';
import type { TextureData } from '../texture/textureData';

export default class Ray {
  private cellHandler: CellHandler;

  public cellPosition!: Position2D;
  public fromPosition!: Position2D;
  public axisX: RayAxis;
  public axisY: RayAxis;
  public distance!: number;
  public fixedDistance!: number;
  public mirrorDistance!: number;
  public side!: Axis;
  public offset!: number;
  public rayAngle: RayAngle;

  public spriteIndexGetter!: (
    rayAngle: RayAngle,
    offset: number,
    textureData: TextureData,
    diff: number
  ) => number;

  constructor(
    position: Position2D,
    rayAngle: RayAngle,
    cellHandler: CellHandler
  ) {
    this.cellHandler = cellHandler;

    this.rayAngle = rayAngle;
    this.axisX = new RayAxis(position, rayAngle, Axis.x);
    this.axisY = new RayAxis(position, rayAngle, Axis.y);
    this.init();
  }

  public init(): void {
    this.axisX.init();
    this.axisY.init();
    this.distance = 0;
    this.fixedDistance = 0;
    this.mirrorDistance = 0;
    this.side = this.axisX.distance > this.axisY.distance ? Axis.x : Axis.y;
    this.cellPosition = {
      x: this.axisX.cellIndex,
      y: this.axisY.cellIndex
    };
    this.fromPosition = {
      x: this.axisX.from,
      y: this.axisY.from
    };
    this.setOffset();
  }

  private setOffset(): void {
    this.offset =
      this.side === Axis.x
        ? this.rayAngle.cos * (this.distance - this.mirrorDistance) +
          this.fromPosition.x
        : this.rayAngle.sin * (this.distance - this.mirrorDistance) +
          this.fromPosition.y;

    this.offset -= this.offset | 0;
  }

  private handleStep(last: boolean): boolean {
    this.cellPosition.x = this.axisX.cellIndex;
    this.cellPosition.y = this.axisY.cellIndex;
    const action = this.cellHandler.handle(this, last);

    if (action === RayAction.stop) return true;

    if (action === RayAction.mirror) {
      if (this.side === Axis.x) {
        this.fromPosition.x = this.axisX.cellIndex + this.offset;
        this.fromPosition.y =
          this.axisY.cellIndex + (this.axisY.sign < 0 ? 1 : 0);

        this.axisY.mirror();
        this.rayAngle.mirrorX();
      } else {
        this.fromPosition.x =
          this.axisX.cellIndex + (this.axisX.sign < 0 ? 1 : 0);
        this.fromPosition.y = this.axisY.cellIndex + this.offset;

        this.axisX.mirror();
        this.rayAngle.mirrorY();
      }
      this.mirrorDistance = this.distance;
    }

    this.side = this.axisX.distance > this.axisY.distance ? Axis.x : Axis.y;

    if (this.side === Axis.x) {
      this.spriteIndexGetter =
        this.rayAngle.sinSign > 0
          ? Painter.prototype.getSpriteIndexBySideX_positive
          : Painter.prototype.getSpriteIndexBySideX_negative;
      this.distance = this.axisY.nextStep();
    } else {
      this.spriteIndexGetter =
        this.rayAngle.cosSign > 0
          ? Painter.prototype.getSpriteIndexBySideY_positive
          : Painter.prototype.getSpriteIndexBySideY_negative;
      this.distance = this.axisX.nextStep();
    }

    this.fixedDistance = this.distance * this.rayAngle.fixDistance;
    this.setOffset();

    return false;
  }

  public send(
    max: number,
    last = true
  ): { stopped: boolean; distance: number } {
    while (this.distance < max) {
      if (this.handleStep(false))
        return {
          stopped: true,
          distance: this.distance
        };
    }

    if (last) this.handleStep(last);

    return { stopped: false, distance: this.distance };
  }
}
