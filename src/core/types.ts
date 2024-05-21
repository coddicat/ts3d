import settings from './settings';
import { MapItemType } from './gameMap/mapItemType';
import Texture from './texture/texture';

export interface Position {
  x: number;
  y: number;
}

export interface Coordinates extends Position {
  z: number;
  angle: number;
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
  continue,
}

export enum Axis {
  x = 0,
  y = 1,
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
