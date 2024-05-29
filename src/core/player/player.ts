import { sign } from '../exts';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import Ray from '../ray/ray';
import { RayAngle } from '../ray/rayAngle';
import settings from '../settings';
import type { MovingItem, Tile, Vector3D } from '../types';
import CollisionHandler from './collisionHandler';
import MovingItemRayHandler from './movingItemRayHandler';

const collisionDistance = 0.5;
const quartPi = Math.PI / 4; //45deg
const halfPi = Math.PI / 2; //90deg
const Pi_34 = (Math.PI / 4) * 3; //135/deg
const Pi1_5 = Math.PI * 1.5;
const acc = -0.00001;
const jumpSpeed = 0.0035;

const cos45 = Math.cos(quartPi);
const cos135 = Math.cos(Pi_34);
const sin45 = Math.sin(quartPi);
const sin135 = Math.sin(Pi_34);

export default class Player {
  private state: PlayerState;
  private gameMap: GameMap;
  private collisionHandler: CollisionHandler;

  private lastTimestamp?: number;
  private moveForward = 0;
  private moveRight = 0;
  private onFloor = true;

  constructor(state: PlayerState, gameMap: GameMap) {
    this.state = state;
    this.gameMap = gameMap;
    this.collisionHandler = new CollisionHandler(state, gameMap);
  }

  private move(dt: number) {
    const state = this.state;

    let cos = state.cos;
    let sin = state.sin;

    const right = this.moveRight;
    const forward = this.moveForward;
    if (!forward && !right) {
      return;
    }

    //45
    if (right > 0 && forward > 0) {
      cos = state.cos * cos45 - state.sin * sin45;
      sin = state.sin * cos45 + state.cos * sin45;
    }
    //-45
    if (right < 0 && forward > 0) {
      cos = state.cos * cos45 + state.sin * sin45;
      sin = state.sin * cos45 - state.cos * sin45;
    }

    //135
    if (right > 0 && forward < 0) {
      cos = state.cos * cos135 - state.sin * sin135;
      sin = state.sin * cos135 + state.cos * sin135;
    }
    //-135
    if (right < 0 && forward < 0) {
      cos = state.cos * cos135 + state.sin * sin135;
      sin = state.sin * cos135 - state.cos * sin135;
    }

    //180
    if (right == 0 && forward < 0) {
      cos = -state.cos;
      sin = -state.sin;
    }
    //-90
    if (right != 0 && forward == 0) {
      cos = -state.sin * right;
      sin = state.cos * right;
    }

    this.moveToCollision(dt, cos, sin, state.position);
  }

  private moveToCollision(dt: number, cos: number, sin: number, pos: Vector3D) {
    const distance = settings.moveSpeed * dt;
    const xDistance = Math.abs(cos * distance);
    const yDistance = Math.abs(sin * distance);
    const xSign = sign(cos);
    const ySign = sign(sin);
    const xAngle = xSign < 0 ? Math.PI : 0;
    const yAngle = ySign < 0 ? Pi1_5 : halfPi;

    const rayXangle = new RayAngle(xAngle);
    const rayYangle = new RayAngle(yAngle);

    const collTollerance = collisionDistance - 0.0001;

    const rayTop = new Ray(
      {
        x: pos.x,
        y: pos.y - collTollerance
      },
      rayXangle,
      this.collisionHandler
    );
    const rayBottom = new Ray(
      {
        x: pos.x,
        y: pos.y + collTollerance
      },
      rayXangle,
      this.collisionHandler
    );

    const rayLeft = new Ray(
      {
        x: pos.x - collTollerance,
        y: pos.y
      },
      rayYangle,
      this.collisionHandler
    );
    const rayRight = new Ray(
      {
        x: pos.x + collTollerance,
        y: pos.y
      },
      rayYangle,
      this.collisionHandler
    );

    const rayXdist = xDistance + collisionDistance;
    const rayYdist = yDistance + collisionDistance;
    const resultTop = rayTop.send(rayXdist);
    const resultBottom = rayBottom.send(rayXdist);
    const resultLeft = rayLeft.send(rayYdist);
    const resultRight = rayRight.send(rayYdist);

    const dx = Math.min(
      xDistance,
      Math.max(0, resultBottom.distance - collisionDistance),
      Math.max(0, resultTop.distance - collisionDistance)
    );
    const dy = Math.min(
      yDistance,
      Math.max(0, resultLeft.distance - collisionDistance),
      Math.max(0, resultRight.distance - collisionDistance)
    );
    pos.x += dx * xSign;
    pos.y += dy * ySign;
  }

  private fall(dt: number): number {
    const state = this.state;

    const speed = state.speedZ + dt * acc;
    const distance = state.speedZ * dt + (acc * dt * dt) / 2;
    state.speedZ = speed;

    return distance;
  }

  public handleMove(forward: number, right: number): void {
    if (!this.onFloor) {
      return;
    }

    this.moveForward = forward;
    this.moveRight = right;
  }

  public jump(): void {
    const state = this.state;

    if (this.onFloor) {
      state.speedZ = jumpSpeed;
    }
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
    const state = this.state;
    const dt = !this.lastTimestamp ? 0 : timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    this.move(dt);

    const tiles =
      this.gameMap.check(state.position.x | 0, state.position.y | 0)?.tiles ??
      [];

    this.stairs(tiles);

    this.onFloor = false;
    const distance = this.fall(dt);

    const oldTopZ = state.top;
    const oldBottomZ = state.position.z;
    const newBottomZ = oldBottomZ + distance;
    const newTopZ = oldTopZ + distance;

    const collisionBottomTiles = tiles.filter(
      tile => tile.bottom > newBottomZ && tile.bottom <= oldBottomZ
    );

    const collisionTopTiles = tiles.filter(
      tile => tile.bottom < newTopZ && tile.bottom >= oldTopZ
    );

    if (collisionTopTiles.length > 0 && collisionBottomTiles.length > 0) {
      this.dead();
    } else if (collisionTopTiles.length > 0) {
      this.ceilCollision(collisionTopTiles);
    } else if (collisionBottomTiles.length > 0) {
      this.floorCollision(collisionBottomTiles, dt);
    } else {
      state.setZ(newBottomZ);
    }
  }

  private stairs(tiles: Tile[]): void {
    const state = this.state;
    const z = state.position.z;

    const collisionSteirTiles = tiles.filter(
      tile => tile.bottom > z && tile.bottom < z + settings.stairsTollerance
    );

    if (collisionSteirTiles.length > 0) {
      const max = Math.max(...collisionSteirTiles.map(t => t.bottom));
      state.setZ(max);
    }
  }

  private floorCollision(collision: Tile[], dt: number) {
    const state = this.state;

    const max = Math.max(...collision.map(t => t.bottom));
    state.speedZ = dt ? (max - state.position.z) / dt : 0;
    state.setZ(max);
    this.onFloor = true;
  }

  private ceilCollision(collision: Tile[]) {
    const state = this.state;
    const min = Math.min(...collision.map(t => t.bottom));
    state.speedZ = 0;
    state.setZ(min - state.height);
  }

  private dead(): void {
    //TODO
    alert('dead');
    this.state.position.x = 3;
    this.state.position.y = 3;
    this.state.setZ(0);
  }
}
