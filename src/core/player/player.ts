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
const halfPi = Math.PI / 2; //90deg
const Pi1_5 = Math.PI * 1.5;
const acc = -0.00001;
const jumpSpeed = 0.004;

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

  private move(dt: number): boolean {
    const state = this.state;
    const right = this.moveRight;
    const forward = this.moveForward;

    if (!forward && !right) {
      return false;
    }

    const cosAngle = state.cos;
    const sinAngle = state.sin;
    const cos = forward * cosAngle - right * sinAngle;
    const sin = forward * sinAngle + right * cosAngle;
    const distance =
      settings.moveSpeed * dt * Math.sqrt(forward ** 2 + right ** 2);
    return this.moveToCollision(distance, cos, sin, state.position);
  }

  private moveToCollision(
    distance: number,
    cos: number,
    sin: number,
    pos: Vector3D
  ): boolean {
    const xDistance = Math.abs(cos * distance);
    const yDistance = Math.abs(sin * distance);
    const xSign = sign(cos);
    const ySign = sign(sin);
    const xAngle = xSign < 0 ? Math.PI : 0;
    const yAngle = ySign < 0 ? Pi1_5 : halfPi;

    const rayXangle = new RayAngle(xAngle);
    const rayYangle = new RayAngle(yAngle);

    const collTollerance = collisionDistance - 0.0001;

    const x = pos.x;
    const y = pos.y;

    const rayTop = new Ray(
      {
        x: x,
        y: y - collTollerance
      },
      rayXangle,
      this.collisionHandler
    );
    const rayBottom = new Ray(
      {
        x: x,
        y: y + collTollerance
      },
      rayXangle,
      this.collisionHandler
    );

    const rayLeft = new Ray(
      {
        x: x - collTollerance,
        y: y
      },
      rayYangle,
      this.collisionHandler
    );
    const rayRight = new Ray(
      {
        x: x + collTollerance,
        y: y
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

    pos.x = x + dx * xSign;
    pos.y = y + dy * ySign;

    return pos.y != y || pos.x != x;
  }

  private fall(dt: number): number {
    const state = this.state;

    const speed = state.speedZ + dt * acc;
    const distance = state.speedZ * dt + (acc * dt * dt) / 2;
    state.speedZ = speed;

    return distance;
  }

  private dead() {
    //TODO access from everywhere to reset
    this.moveForward = 0;
    this.moveRight = 0;
    this.lastTimestamp = undefined;
    this.onFloor = true;
    this.state.dead();
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
    const dt = !this.lastTimestamp ? 0 : timestamp - this.lastTimestamp;

    this.gameMap.interactObjects(this.state);
    //life
    this.state.life -= dt / 500;
    if (this.state.life <= 0) {
      //TODO
      this.dead();
    }

    //movement
    const state = this.state;
    const pos = state.position;
    this.lastTimestamp = timestamp;

    const tiles = this.gameMap.check(pos.x | 0, pos.y | 0)?.tiles ?? [];

    this.onFloor = false;
    const distance = this.fall(dt);
    if (this.tileCollision(tiles, distance, dt)) {
      return;
    }
    if (this.checkdead(tiles)) {
      return;
    }

    this.move(dt);
    this.stairs();
  }

  private tileCollision(tiles: Tile[], distance: number, dt: number): boolean {
    const state = this.state;

    const oldTopZ = state.top;
    const oldBottomZ = state.position.z;
    const newBottomZ = oldBottomZ + distance;
    const newTopZ = oldTopZ + distance;

    const collisionBottomTiles = tiles.filter(
      tile =>
        tile.bottom > newBottomZ &&
        (tile.prevBottom ?? tile.bottom) <= oldBottomZ
    );

    const collisionTopTiles = tiles.filter(
      tile =>
        tile.bottom < newTopZ && (tile.prevBottom ?? tile.bottom) >= oldTopZ
    );

    if (collisionTopTiles.length > 0 && collisionBottomTiles.length > 0) {
      this.dead();
      return true;
    } else if (collisionTopTiles.length > 0) {
      this.ceilCollision(collisionTopTiles);
    } else if (collisionBottomTiles.length > 0) {
      this.floorCollision(collisionBottomTiles, dt);
    } else {
      state.setZ(newBottomZ);
    }
    return false;
  }

  private checkdead(tiles: Tile[]): boolean {
    const state = this.state;
    const bottom = state.position.z;
    const top = state.top;

    if (tiles.some(tile => tile.bottom > bottom && tile.bottom < top)) {
      this.dead();
      return true;
    }
    return false;
  }

  private stairs(): void {
    const state = this.state;
    const pos = state.position;
    const z = pos.z;

    const tiles = this.gameMap.check(pos.x | 0, pos.y | 0)?.tiles ?? [];

    const collisionStairTiles = tiles.filter(
      tile => tile.bottom > z && tile.bottom <= z + settings.stairsTollerance
    );

    if (collisionStairTiles.length > 0) {
      const max = Math.max(...collisionStairTiles.map(t => t.bottom));
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
}
