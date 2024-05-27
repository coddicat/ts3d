import settings from './settings';
import type { MapItemType } from './gameMap/mapItemType';
import type Texture from './texture/texture';

export interface Position2D {
  x: number;
  y: number;
}

export interface Position3D extends Position2D {
  z: number;
}

export interface Vector3D extends Position3D {
  angle: number;
}

export enum Axis {
  x = 0,
  y = 1
}

export type Tile = {
  bottom: number;
  texture?: Texture;
  name?: string;
  speed?: number;
};

export type Wall = {
  top: number;
  bottom: number;
  texture?: Texture;
  name?: string;
};

export type MapItem = {
  walls: Wall[];
  tiles: Tile[];
  stopRay: boolean;
  mirror?: boolean;
  transparent?: number;

  //runtime
  aboveTiles?: Tile[];
  belowTiles?: Tile[];
  playerStateTimestamp?: number;
};

export enum RayAction {
  stop,
  mirror,
  continue
}

export type SpriteAngleState = {
  lastDistance: number;
};

export class PixelCounter {
  private count = 0;
  public empty = true;

  public reset(): void {
    this.count = 0;
    this.empty = true;
  }
  public increse(): boolean {
    return (this.empty = ++this.count < settings.resolutionHeight);
  }
}

export type ItemSet = {
  set: { x: number; y: number }[];
  mapItem: MapItem;
};

export type ItemSetByKey = {
  type: MapItemType;
  sets: ItemSet[];
};

export type MovingItem = {
  props: MovingItemProps;
  set: ItemSet;
  state: boolean;
  timestamp: number;
};

export type MovingItemProps = {
  initMovingItem: (set: ItemSet, props: MovingItemProps) => MovingItem;
  tick: (t: number, item: MovingItem) => boolean;
};

export type ItemSetGetter = (
  repeatX: number,
  startX: number,
  startY: number
) => MapItem;
