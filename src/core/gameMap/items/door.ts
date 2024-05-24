//import Texture from '../../texture/texture';
import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type {
  ItemSet,
  Level,
  MapItem,
  MovingItem,
  MovingItemProps,
  Wall
} from '../../types';
import { basementWall } from './wallMain';

const hight = 2.5;
const middle = 1.5;
const speed = 2000;
const dy = hight - middle;

const getDoorLevelTop = (): Level => ({
  name: 'top',
  color: 0x02f00,
  bottom: middle,
  texture: new Texture(TextureType.FloorMetal, 1)
});

const getDoorLevelBottom = (): Level => ({
  name: 'bottom',
  color: 0x002f00,
  bottom: middle,
  texture: new Texture(TextureType.FloorMetal, 1)
});

const getDoorWallTop = (
  repeatX: number,
  startX: number,
  startY: number
): Wall => ({
  name: 'top',
  color: 0x0000ff,
  top: hight,
  bottom: middle,
  render: true,
  texture: new TextureSet(
    TextureType.DoorTop,
    hight - middle,
    startX,
    startY,
    repeatX,
    true
  )
});

const getDoorWallBottom = (
  repeatX: number,
  startX: number,
  startY: number
): Wall => ({
  name: 'bottom',
  color: 0x0000ff,
  top: middle,
  bottom: 0,
  render: true,
  texture: new TextureSet(
    TextureType.DoorBottom,
    middle,
    startX,
    startY,
    repeatX,
    false
  )
});

const getDoorWallAbove = (
  repeatX: number,
  startX: number,
  startY: number
): Wall => ({
  name: 'above',
  color: 0xcccccc,
  top: hight + dy,
  bottom: hight,
  render: true,
  texture: new TextureSet(
    TextureType.DoorAbove,
    middle,
    startX,
    startY,
    repeatX,
    false
  )
});

const initMovingItem = (set: ItemSet, props: MovingItemProps): MovingItem => ({
  props,
  set,
  timestamp: 0,
  state: true
});

export const doorMovingItemProps: MovingItemProps = {
  initMovingItem,
  tick: (t: number, item: MovingItem) => {
    const mapItem = item.set.mapItem;
    const topWall = mapItem.walls.find(x => x.name === 'top');
    const bottomWall = mapItem.walls.find(x => x.name === 'bottom');
    const topLevel = mapItem.levels.find(x => x.name === 'top');
    const bottomLevel = mapItem.levels.find(x => x.name === 'bottom');

    if (t > speed) {
      topWall!.top = item.state ? hight : hight + dy;
      topWall!.bottom = topLevel!.bottom = item.state ? middle : hight;

      bottomWall!.top = bottomLevel!.bottom = item.state ? middle : 0;
      bottomWall!.bottom = item.state ? 0 : 0 - middle;

      return true;
    }

    const s0 = dy / speed;
    const l0 = s0 * t;

    const s1 = middle / speed;
    const l1 = s1 * t;

    topWall!.top = item.state ? hight + dy - l0 : hight + l0;
    topWall!.bottom = topLevel!.bottom = item.state
      ? middle + dy - l0
      : middle + l0;

    bottomWall!.top = bottomLevel!.bottom = item.state ? l1 : middle - l1;
    bottomWall!.bottom = item.state ? l1 - middle : 0 - l1;

    return false;
  }
};

export default (repeatX: number, startX: number, startY: number): MapItem => ({
  walls: [
    getDoorWallAbove(repeatX, startX, startY),
    getDoorWallTop(repeatX, startX, startY),
    getDoorWallBottom(repeatX, startX, startY),
    basementWall
  ],
  levels: [getDoorLevelTop(), getDoorLevelBottom()],
  stopRay: false
});
