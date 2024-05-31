import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import { Wall } from '../../types';
import type {
  ItemSet,
  Tile,
  MapItem,
  MovingItem,
  MovingItemProps
} from '../../types';

import { getBasementWall } from './basic';

const hight = 2.5;
const middle = 1.5;
const speed = 2000;
const dy = hight - middle;

const getDoorTileTop = (): Tile => ({
  name: 'top',
  bottom: middle,
  texture: new Texture(TextureType.DoorTile, 1)
});

const getDoorTileBottom = (): Tile => ({
  name: 'bottom',
  bottom: middle,
  texture: new Texture(TextureType.DoorTile, 1)
});

const getDoorWallTop = (
  repeatX: number,
  startX: number,
  startY: number
): Wall =>
  new Wall(
    hight,
    middle,
    new TextureSet(
      TextureType.DoorTop,
      hight - middle,
      startX,
      startY,
      repeatX,
      true
    ),
    'top'
  );

const getDoorWallBottom = (
  repeatX: number,
  startX: number,
  startY: number
): Wall =>
  new Wall(
    middle,
    0,
    new TextureSet(
      TextureType.DoorBottom,
      middle,
      startX,
      startY,
      repeatX,
      false
    ),
    'bottom'
  );

const getDoorWallAbove = (
  repeatX: number,
  startX: number,
  startY: number
): Wall =>
  new Wall(
    hight + dy,
    hight,
    new TextureSet(
      TextureType.DoorAbove,
      middle,
      startX,
      startY,
      repeatX,
      false
    ),
    'above'
  );

const initMovingItem = (set: ItemSet, props: MovingItemProps): MovingItem => ({
  props,
  set,
  timestamp: 0,
  state: true //closed
});

export const doorMovingItemProps: MovingItemProps = {
  initMovingItem,
  tick: (t: number, item: MovingItem) => {
    const mapItem = item.set.mapItem;
    const topWall = mapItem.walls.find(x => x.name === 'top');
    const bottomWall = mapItem.walls.find(x => x.name === 'bottom');
    const topTile = mapItem.tiles.find(x => x.name === 'top');
    const bottomTile = mapItem.tiles.find(x => x.name === 'bottom');

    if (t > speed) {
      topWall!.top = item.state ? hight : hight + dy;
      topWall!.bottom = topTile!.bottom = item.state ? middle : hight;

      bottomWall!.top = bottomTile!.bottom = item.state ? middle : 0;
      bottomWall!.bottom = item.state ? 0 : 0 - middle;
      return true;
    }

    const s0 = dy / speed;
    const l0 = s0 * t;

    const s1 = middle / speed;
    const l1 = s1 * t;

    topWall!.top = item.state ? hight + dy - l0 : hight + l0;
    topWall!.bottom = topTile!.bottom = item.state
      ? middle + dy - l0
      : middle + l0;

    bottomWall!.top = bottomTile!.bottom = item.state ? l1 : middle - l1;
    bottomWall!.bottom = item.state ? l1 - middle : 0 - l1;

    return false;
  }
};

export const doorWall = (
  repeatX: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getDoorWallAbove(repeatX, startX, startY),
    getDoorWallTop(repeatX, startX, startY),
    getDoorWallBottom(repeatX, startX, startY),
    getBasementWall(startX, startY)
  ],
  tiles: [getDoorTileTop(), getDoorTileBottom()],
  stopRay: false
});
