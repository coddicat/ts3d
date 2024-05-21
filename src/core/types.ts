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

export type Level = {
  color: number;
  bottom: number;
  texture: null | Texture;
  name?: string | undefined;
  speed?: number | undefined;
};

export type Wall = {
  color: number;
  top: number;
  bottom: number;
  render: boolean;
  texture: null | Texture;
  name?: string | undefined;
};

export type MapItem = {
  walls: Wall[];
  levels: Level[];
  stopRay: boolean;
  mirror?: boolean;

  //runtime
  aboveLevels?: Level[];
  belowLevels?: Level[];
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
    return (this.empty = ++this.count < settings.resolution.height);
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
