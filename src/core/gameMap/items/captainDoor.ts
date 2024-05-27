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
import { getBasementWall, roomHeight } from './basic';

const hight = roomHeight;
const speed = 2000;

const getDoorTopLevel = (bottom: number): Level => ({
  name: 'door',
  bottom: bottom,
  texture: new Texture(TextureType.DoorLevel, 1)
});
const getDoorBottomLevel = (): Level => ({
  name: 'door',
  bottom: 0,
  texture: new Texture(TextureType.DoorLevel, 1)
});

const getDoorWall = (
  repeatX: number,
  startX: number,
  startY: number
): Wall => ({
  name: 'door',
  top: hight,
  bottom: 0,

  texture: new TextureSet(
    TextureType.CaptainDoor,
    hight,
    startX,
    startY,
    repeatX,
    false,
    true
  )
});

const initMovingItem = (set: ItemSet, props: MovingItemProps): MovingItem => ({
  props,
  set,
  timestamp: 0,
  state: true //closed
});

export const captainDoorMovingItemProps: MovingItemProps = {
  initMovingItem,
  tick: (t: number, item: MovingItem) => {
    const mapItem = item.set.mapItem;
    const wall = mapItem.walls.find(x => x.name === 'door');
    const level = mapItem.levels.find(x => x.name === 'door');

    if (t > speed) {
      wall!.top = item.state ? hight : hight + hight;
      wall!.bottom = level!.bottom = item.state ? 0 : hight;

      return true;
    }

    const s0 = hight / speed;
    const l0 = s0 * t;

    wall!.top = item.state ? hight + hight - l0 : hight + l0;
    wall!.bottom = level!.bottom = item.state ? hight - l0 : l0;

    return false;
  }
};

export const captainDoorWall = (
  repeatX: number,
  startX: number,
  startY: number
): MapItem => ({
  walls: [
    getDoorWall(repeatX, startX, startY),
    getBasementWall(startX, startY)
  ],
  levels: [getDoorTopLevel(0), getDoorBottomLevel(), getDoorTopLevel(3.5)],
  stopRay: false
});
