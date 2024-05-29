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

  private _offset?: number;
  public get offset(): number {
    if (this._offset === undefined) {
      this._offset = this.getOffset();
    }
    return this._offset;
  }
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
    this._offset = undefined;
  }

  private getOffset(): number {
    const dif = this.distance - this.mirrorDistance;
    const offset =
      this.side === Axis.x
        ? this.rayAngle.cos * dif + this.fromPosition.x
        : this.rayAngle.sin * dif + this.fromPosition.y;

    return offset - (offset | 0);
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
          ? Painter.prototype.getTileSpriteIndexBySideX_positive
          : Painter.prototype.getTileSpriteIndexBySideX_negative;
      this.distance = this.axisY.nextStep();
    } else {
      this.spriteIndexGetter =
        this.rayAngle.cosSign > 0
          ? Painter.prototype.getTileSpriteIndexBySideY_positive
          : Painter.prototype.getTileSpriteIndexBySideY_negative;
      this.distance = this.axisX.nextStep();
    }

    this.fixedDistance = this.distance * this.rayAngle.fixDistance;
    this._offset = undefined;

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
