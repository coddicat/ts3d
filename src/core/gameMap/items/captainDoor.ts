import Texture from '../../texture/texture';
import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';
import type {
  ItemSet,
  Tile,
  MapItem,
  MovingItem,
  MovingItemProps,
  Wall
} from '../../types';
import { getBasementWall, roomHeight } from './basic';

const hight = roomHeight;
const speed = 2000;

const getDoorTopTile = (bottom: number): Tile => ({
  name: 'door',
  bottom: bottom,
  texture: new Texture(TextureType.DoorTile, 1)
});
const getDoorBottomTile = (): Tile => ({
  name: 'door',
  bottom: 0,
  texture: new Texture(TextureType.DoorTile, 1)
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
    const tile = mapItem.tiles.find(x => x.name === 'door');

    if (t > speed) {
      wall!.top = item.state ? hight : hight + hight;
      wall!.bottom = tile!.bottom = item.state ? 0 : hight;

      return true;
    }

    const s0 = hight / speed;
    const l0 = s0 * t;

    wall!.top = item.state ? hight + hight - l0 : hight + l0;
    wall!.bottom = tile!.bottom = item.state ? hight - l0 : l0;

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
  tiles: [getDoorTopTile(0), getDoorBottomTile(), getDoorTopTile(3.5)],
  stopRay: false
});
