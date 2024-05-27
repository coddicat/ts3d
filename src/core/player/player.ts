import { sign } from '../exts';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import Ray from '../ray/ray';
import { RayAngle } from '../ray/rayAngle';
import settings from '../settings';
import type { MovingItem, Position2D } from '../types';
import CollisionHandler from './collisionHandler';
import MovingItemRayHandler from './movingItemRayHandler';

const collisionDistance = 0.6;
const quartPi = Math.PI / 4; //45deg
const halfPi = Math.PI / 2; //90deg
const Pi_34 = (Math.PI / 4) * 3; //135/deg
const Pi1_5 = Math.PI * 1.5;
const acc = 0.0001;

const cos45 = Math.cos(quartPi);
const cos135 = Math.cos(Pi_34);
const sin45 = Math.sin(quartPi);
const sin135 = Math.sin(Pi_34);

export default class Player {
  private state: PlayerState;
  private gameMap: GameMap;
  private collisionHandler: CollisionHandler;

  constructor(state: PlayerState, gameMap: GameMap) {
    this.state = state;
    this.gameMap = gameMap;
    this.collisionHandler = new CollisionHandler(state, gameMap);
  }

  private move(dt: number, forward: number, right: number) {
    const state = this.state;
    const pos = state.position;

    let userAngle = pos.angle;

    let cos = state.cos;
    let sin = state.sin;

    //45
    if (right > 0 && forward > 0) {
      cos = state.cos * cos45 - state.sin * sin45;
      sin = state.sin * cos45 + state.cos * sin45;
      userAngle += quartPi;
    }
    //-45
    if (right < 0 && forward > 0) {
      cos = state.cos * cos45 + state.sin * sin45;
      sin = state.sin * cos45 - state.cos * sin45;
      userAngle -= quartPi;
    }

    //135
    if (right > 0 && forward < 0) {
      cos = state.cos * cos135 - state.sin * sin135;
      sin = state.sin * cos135 + state.cos * sin135;
      userAngle += Pi_34;
    }
    //-135
    if (right < 0 && forward < 0) {
      cos = state.cos * cos135 + state.sin * sin135;
      sin = state.sin * cos135 - state.cos * sin135;
      userAngle -= Pi_34;
    }

    //180
    if (right == 0 && forward < 0) {
      cos = -state.cos;
      sin = -state.sin;
      userAngle += Math.PI;
    }
    //-90
    if (right != 0 && forward == 0) {
      cos = -state.sin * right;
      sin = state.cos * right;
      userAngle += halfPi * right;
    }

    const distance = settings.moveSpeed * dt;
    const xDistance = cos * distance;
    const yDistance = sin * distance;

    let nx = pos.x + xDistance;
    let ny = pos.y + yDistance;

    const xSign = sign(cos);
    const ySign = sign(sin);
    const xAngle = xSign < 0 ? Math.PI : 0;
    const yAngle = ySign < 0 ? Pi1_5 : halfPi;

    const ray = new Ray(pos, new RayAngle(userAngle), this.collisionHandler);
    const rayX = new Ray(pos, new RayAngle(xAngle), this.collisionHandler);
    const rayY = new Ray(pos, new RayAngle(yAngle), this.collisionHandler);

    const xres = rayX.send(Math.abs(xDistance) + collisionDistance, false);
    const yres = rayY.send(Math.abs(yDistance) + collisionDistance, false);
    if (xres.stopped) {
      const d = Math.max(0, xres.distance - collisionDistance);
      nx = pos.x + d * xSign;
    }
    if (yres.stopped) {
      const d = Math.max(0, yres.distance - collisionDistance);
      ny = pos.y + d * ySign;
    }

    const res =
      !xres.stopped &&
      !yres.stopped &&
      ray.send(distance + collisionDistance, false).stopped;
    if (res) {
      nx = pos.x;
      ny = pos.y;
    }

    pos.x = nx;
    pos.y = ny;
  }

  public handleMove(timestamp: number, forward: number, right: number): void {
    const state = this.state;

    if (!forward && !right) {
      state.movingTimestamp = null;
    }

    if (state.movingTimestamp) {
      this.move(timestamp - state.movingTimestamp, forward, right);
    }

    this.checkFloor(state.position, timestamp);
    state.movingTimestamp = timestamp;
  }

  private checkFloor(pos: Position2D, timestamp: number): void {
    const item = this.gameMap.check(pos.x | 0, pos.y | 0);

    if (!item) {
      this.fall(timestamp);
      return;
    }
    const levels = item.tiles
      .filter(
        tile =>
          tile.bottom >= this.state.position.z && tile.bottom < this.state.top
      )
      .map(x => x.bottom);
    const level = levels.length > 0 ? Math.max(...levels) : null;
    const cl = item.tiles.find(
      tile =>
        tile.bottom < this.state.top &&
        tile.bottom > this.state.position.z + this.state.halfHeight
    );

    if (cl) {
      //dead;
      alert('dead');
      this.state.position.x = 3;
      this.state.position.y = 3;
      this.state.setZ(0, false);
      return;
    }

    if (level != null) {
      this.state.setZ(level, true);
      return;
    }
    this.fall(timestamp);
  }

  private fall(timestamp: number): void {
    this.state.jumpingTimestamp = this.state.jumpingTimestamp ?? timestamp;
  }

  public jump(timestamp: number): void {
    if (this.state.jumpingTimestamp) {
      return;
    }
    this.state.jumpingTimestamp = timestamp;
    this.state.jumpingFloor = this.state.position.z;
    this.state.jumpingSpeed = 0.02;
  }

  public checkMovingItem(): MovingItem | null {
    const handler = new MovingItemRayHandler(this.gameMap);
    const ray = new Ray(
      this.state.position,
      new RayAngle(this.state.position.angle),
      handler
    );
    ray.send(5, false);

    return handler.item ?? null;
  }

  public tick(timestamp: number): void {
    if (!this.state.jumpingTimestamp) {
      return;
    }

    const t = timestamp - this.state.jumpingTimestamp;
    const v0 = this.state.jumpingSpeed ?? 0;
    const newZ = (this.state.jumpingFloor ?? 0) + t * (v0 - acc * (t >> 1));

    if (newZ === this.state.position.z) return;

    this.state.timestamp++;
    const tiles =
      this.gameMap.check(this.state.position.x | 0, this.state.position.y | 0)
        ?.tiles ?? [];

    const topTiles = tiles
      .filter(
        x => this.state.top <= x.bottom && newZ + this.state.height >= x.bottom
      )
      .map(x => x.bottom);

    const topTile = Math.min(...topTiles);

    if (topTiles.length > 0) {
      this.state.jumpingSpeed = 0;
      this.state.setZ(topTile - this.state.height, true);
      return;
    }

    const bottom = tiles.filter(
      x => this.state.position.z >= x.bottom && newZ < x.bottom
    );
    const bottomTiles = bottom.map(x => x.bottom);
    const bottomTile = Math.max(...bottomTiles);

    if (bottomTiles.length > 0) {
      this.state.jumpingSpeed =
        bottom.find(x => x.bottom === bottomTile)?.speed ?? 0;
      if (this.state.jumpingSpeed === 0) {
        this.state.jumpingTimestamp = null;
      }
      this.state.setZ(bottomTile, true);
    } else {
      this.state.setZ(newZ, false);
    }
  }
}
