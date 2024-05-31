import settings from './settings';
import type { MapItemType } from './gameMap/mapItemType';
import type Texture from './texture/texture';
import { mod } from './exts';

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
  prevBottom?: number; //due to canvas timespan
};

export class Wall {
  public top: number;
  public bottom: number;
  public texture?: Texture;
  public name?: string;

  private _repeatHeight?: number;
  public get repeatHeight(): number {
    return (
      (this._repeatHeight = this._repeatHeight ?? this.getRepeatHeight()) ?? 0
    );
  }
  public getRepeatHeight(): number | undefined {
    if (!this.texture?.data) {
      return undefined;
    }
    return (
      ((this.top - this.bottom) * this.texture.data.height) /
      this.texture.repeat
    );
  }

  private _heightFactor?: number;
  public get heightFactor(): number {
    return (
      (this._heightFactor = this._heightFactor ?? this.getHeightFactor()) ?? 0
    );
  }
  public getHeightFactor(): number | undefined {
    if (!this.texture?.data || !this.repeatHeight) {
      return undefined;
    }
    const height = this.texture.data.height;
    return height - mod(this.repeatHeight, height);
  }

  constructor(top: number, bottom: number, texture?: Texture, name?: string) {
    this.top = top;
    this.bottom = bottom;
    this.texture = texture;
    this.name = name;
  }
}

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
