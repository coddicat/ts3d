import { angle, norm } from '../exts';
import type { GameMap } from '../gameMap/gameMap';
import type PlayerState from '../player/playerState';
import type Ray from './ray';
import type RayCasting from './rayCasting';
import Render from '../render/render';
import type SpriteObject from '../sprite/spriteObject';
import type { MapItem, SpriteAngleState } from '../types';
import { RayAction, PixelCounter } from '../types';
import settings from '../settings';
import type SpriteStore from '../sprite/spriteStore';

export interface CellHandler {
  handle(rayState: Ray, last: boolean): RayAction;
}

const rad45 = Math.PI / 4;
const rad180 = Math.PI;
const rad360 = Math.PI * 2;

class RayHandler implements CellHandler {
  public prevItem: MapItem | null;
  public newItem: MapItem | null;
  public prevDistance: number;
  public newDistance: number;
  public alphaMaxLightFact: number;
  public gameMap: GameMap;

  private pixelsCounter: PixelCounter;
  private playerState: PlayerState;
  private rayCastingState: RayCasting;
  private render: Render;

  private spriteStore: SpriteStore;
  private spriteState: SpriteAngleState;

  constructor(
    playerState: PlayerState,
    spriteStore: SpriteStore,
    rayCastingState: RayCasting,
    gameMap: GameMap
  ) {
    this.rayCastingState = rayCastingState;
    this.prevItem = null;
    this.newItem = null;
    this.prevDistance = 0.2;
    this.newDistance = 0.2;
    this.alphaMaxLightFact = settings.maxLightFact;
    this.pixelsCounter = new PixelCounter();
    this.playerState = playerState;
    this.gameMap = gameMap;

    this.spriteStore = spriteStore;
    this.spriteState = {
      lastDistance: 0.6
    };

    this.render = new Render(
      this.rayCastingState,
      this,
      this.playerState,
      this.pixelsCounter
    );
  }

  public reset(): void {
    this.prevItem = null;
    this.newItem = null;
    this.prevDistance = 0.2;
    this.newDistance = 0.2;
    this.alphaMaxLightFact = settings.maxLightFact;
    this.pixelsCounter.reset();
    this.spriteState.lastDistance = 0.6;
  }

  public handle(ray: Ray, last: boolean): RayAction {
    const pos = ray.cellPosition;
    this.newItem = this.gameMap.check(pos.x, pos.y);
    this.newDistance = ray.distance * this.rayCastingState.rayAngle.fixDistance;

    if (
      this.prevItem &&
      this.newItem != this.prevItem &&
      this.prevItem.transparent
    ) {
      this.alphaMaxLightFact *= this.prevItem.transparent;
    }

    if (this.newItem !== this.prevItem || last) {
      this.handleTiles(ray);
      if (!this.pixelsCounter.empty) return RayAction.stop;
      this.render.handleWalls(ray);

      this.prevItem = this.newItem;
      this.prevDistance = this.newDistance < 0.2 ? 0.2 : this.newDistance;
    }

    if (this.newItem && this.newItem.mirror) {
      return RayAction.mirror;
    }

    return !this.pixelsCounter.empty || (this.newItem && this.newItem.stopRay)
      ? RayAction.stop
      : RayAction.continue;
  }

  private refs = {
    playerStateTimestamp: null as null | number,
    aboveObjects: [] as SpriteObject[],
    belowObjects: [] as SpriteObject[]
  };

  private handleTiles(ray: Ray): void {
    if (!this.prevItem || this.prevDistance < 0.2) return;

    if (this.refs.playerStateTimestamp !== this.playerState.timestamp) {
      const spriteObjects = this.spriteStore.spriteObjects;

      this.refs.aboveObjects = spriteObjects.filter(
        o => o.position.z > this.playerState.lookZ
      );
      this.refs.belowObjects = spriteObjects.filter(
        o => o.position.z <= this.playerState.lookZ
      );
      this.refs.playerStateTimestamp = this.playerState.timestamp;
    }

    if (this.prevItem.playerStateTimestamp !== this.playerState.timestamp) {
      this.prevItem.aboveTiles = this.prevItem.tiles.filter(
        x => x.bottom > this.playerState.lookZ
      );
      this.prevItem.belowTiles = this.prevItem.tiles
        .filter(x => x.bottom < this.playerState.lookZ)
        .reverse();
      this.prevItem.playerStateTimestamp = this.playerState.timestamp;
    }

    for (const tile of this.prevItem.belowTiles!) {
      for (const obj of this.refs.belowObjects) {
        if (obj.position.z < tile.bottom) continue;
        this.handleSprite(ray, obj);
        if (!this.pixelsCounter.empty) return;
      }

      this.render.handleTile(ray, tile);
      if (!this.pixelsCounter.empty) return;
    }

    for (const tile of this.prevItem.aboveTiles!) {
      if (!this.pixelsCounter.empty) return;

      for (const obj of this.refs.aboveObjects) {
        if (obj.position.z >= tile.bottom) continue;
        this.handleSprite(ray, obj);
        if (!this.pixelsCounter.empty) return;
      }

      this.render.handleTile(ray, tile);
    }

    // for (const obj of this.spriteObjects) {
    //   this.handleSprite(ray, obj);
    //   if (!this.pixelsCounter.empty) return;
    // }
  }

  private handleSprite(ray: Ray, sprite: SpriteObject): void {
    if (sprite.timestamp === ray.rayAngle.timestamp) return;

    const dx = sprite.position.x - ray.fromPosition.x;
    const dy = sprite.position.y - ray.fromPosition.y;

    const rayDistance =
      (dy - dx * ray.rayAngle.tan90) / ray.rayAngle.spriteFact;

    if (rayDistance < 0.3) return;

    const distance =
      (ray.mirrorDistance + rayDistance) *
      this.rayCastingState.rayAngle.fixDistance;

    if (this.newDistance < distance) return;

    const sideDistance =
      (ray.rayAngle.sin * rayDistance - dy) / ray.rayAngle.cos;

    let texture;
    let side = 1;
    if (sprite.textures.length > 2 && sprite !== this.playerState) {
      const a0 = angle(
        sprite.position,
        //todo should be due to user coordinates but with mirror fact
        ray.fromPosition
      );
      const a = norm(a0 + norm(sprite.position.angle));

      if (a < rad45 || a > rad360 - rad45) {
        texture = sprite.textures[1];
      } else if (a < rad180 + rad45 && a > rad180 - rad45) {
        texture = sprite.textures[0];
      } else {
        texture = sprite.textures[2];
        side = a < rad180 ? 1 : -1;
      }
    } else {
      texture = sprite.textures[0];
    }
    if (Math.abs(sideDistance) > sprite.halfWidth) return;

    sprite.timestamp = this.rayCastingState.rayAngle.timestamp;

    this.render.handleSprite(
      sprite,
      distance,

      //spriteX:
      ((side * sideDistance + sprite.halfWidth) * sprite.ratio) | 0,

      texture.data!
    );
  }
}

export default RayHandler;
