import textureStore from '../texture/textureStore';
import type {
  ItemSet,
  ItemSetByKey,
  Tile,
  MapItem,
  MovingItem,
  Wall
} from '../types';
import gridMap from './grid';
import type { MapItemType } from './mapItemType';
import { mapItemTypeKeys } from './mapItemType';
import { outmapItem, emptyItem } from './items/basic';
import { singleItems, itemsInSet, movingTypes } from './items';
import type SpriteStore from '../sprite/spriteStore';

import type PlayerState from '../player/playerState';

export class GameMap {
  private mapData!: MapItem[][];
  private setsByKey!: ItemSetByKey[];
  private movingItems: MovingItem[] = [];
  private currentMovingItem: MovingItem | null = null;
  private resetMovingItem = false;
  private spriteStore: SpriteStore;

  private initTextures(arr: Tile[] | Wall[]): void {
    for (const item of arr) {
      if (!item.texture) continue;
      const data = textureStore.getTextureData(item.texture.type);
      if (!data) continue;
      item.texture.setData(data);
    }
  }

  private getItem(strKey: string, x: number, y: number): MapItem {
    const key = mapItemTypeKeys.get(strKey);
    let item;
    if (key && itemsInSet.has(key)) {
      const itemSet = this.setsByKey.find(x => x.type === key);
      const set = itemSet?.sets.find(d =>
        d.set.find(s => s.x === x && s.y === y)
      );
      item = set?.mapItem;
    } else {
      item = key && singleItems.get(key);
    }
    if (!item) item = emptyItem;

    this.initTextures(item.tiles);
    this.initTextures(item.walls);
    item.tiles.sort((a, b) => a.bottom - b.bottom);
    item.walls.sort((a, b) => a.bottom - b.bottom);
    return item;
  }

  private getItemSet(
    arr: boolean[][],
    typeCode: string,
    y: number,
    x: number
  ): { x: number; y: number }[] | null {
    if (arr[y] && arr[y][x]) return null;
    let res = null as null | { x: number; y: number }[];
    if (gridMap[y][x] === typeCode) {
      res = [{ x, y }];
      //right
      if (x + 1 < gridMap[y].length - 1) {
        const right = this.getItemSet(arr, typeCode, y, x + 1);
        if (right) {
          res = [...res, ...right];
        }
      }
      //down
      if (y + 1 < gridMap.length - 1) {
        const down = this.getItemSet(arr, typeCode, y + 1, x);
        if (down) {
          res = [...res, ...down];
        }
      }
    }

    if (!arr[y]) arr[y] = [];
    arr[y][x] = true;

    return res;
  }

  private findItemSets(type: MapItemType): ItemSet[] {
    const keyStr = [...mapItemTypeKeys.entries()].find(x => x[1] === type)?.[0];

    if (!keyStr) return [];

    const itemGenerator = itemsInSet.get(type);
    if (!itemGenerator) return [];

    const arr = [] as boolean[][];
    const res: ItemSet[] = [];

    for (let r = 0; r < gridMap.length; r++) {
      const row = gridMap[r];
      for (let c = 0; c < row.length; c++) {
        const set = this.getItemSet(arr, keyStr, r, c);
        if (set) {
          const item = itemGenerator(set.length, c, r);
          res.push({
            set: set,
            mapItem: item
          });
        }
      }
    }

    return res;
  }

  private initMovingItems(type: MapItemType, sets: ItemSet[]): void {
    const props = movingTypes.get(type);
    if (!props) return;

    sets.forEach(s => {
      this.movingItems.push(props.initMovingItem(s, props));
    });
  }

  constructor(spriteStore: SpriteStore) {
    this.spriteStore = spriteStore;
  }

  public async init(): Promise<void> {
    const types = [...itemsInSet.keys()];
    this.setsByKey = [];
    types.forEach(type => {
      const sets = this.findItemSets(type);
      this.setsByKey.push({
        type,
        sets
      });
      this.initMovingItems(type, sets);
    });

    this.mapData = gridMap.map((row: string, y: number) =>
      [...row].map((c: string, x: number) => this.getItem(c, x, y))
    );
  }

  public check(x: number, y: number): MapItem {
    const mapData = this.mapData;

    if (y < 0 || y >= mapData.length || x < 0) return outmapItem;
    if (x >= mapData[y].length) return outmapItem;

    return mapData[y][x];
  }

  public tickMovingItem(timestamp: number): void {
    const current = this.currentMovingItem;
    if (!current) return;

    if (this.resetMovingItem) {
      this.currentMovingItem = null;
      current.set.mapItem.tiles.forEach(tile => (tile.prevBottom = undefined));
      return;
    }

    current.set.mapItem.tiles.forEach(tile => (tile.prevBottom = tile.bottom));

    if (current.props.tick(timestamp - current.timestamp, current)) {
      this.resetMovingItem = true;
    }
  }

  public toggleMovingItem(item: MovingItem, timestamp: number): void {
    if (this.currentMovingItem) return;

    item.timestamp = timestamp;
    item.state = !item.state;
    this.currentMovingItem = item;
    this.resetMovingItem = false;
  }

  public findMovingItem(x: number, y: number): MovingItem | undefined {
    return this.movingItems.find(d =>
      d.set.set.find(s => s.x === x && s.y === y)
    );
  }

  public interactObjects(state: PlayerState): void {
    const userPos = state.position;
    const object = this.spriteStore.spriteObjects.find(o => {
      if (!o.interaction) return false;

      const pos = o.position;
      if (pos.z + o.height < userPos.z || pos.z > state.top) {
        return false;
      }

      const d = (userPos.x - pos.x) ** 2 + (userPos.y - pos.y) ** 2;
      const r = (o.width + state.halfWidth) ** 2;
      return d <= r;
    });
    if (!object) return;

    object.interaction!(state, this.spriteStore);
  }
}
