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
const direction = 1;

const getDoorTopTile = (stat: boolean): Tile => ({
  name: stat ? 'static' : 'top',
  bottom: stat ? hight / 2 - (direction * hight) / 2 : hight,
  texture: new Texture(TextureType.DoorTile, 1)
});
const getDoorBottomTile = (): Tile => ({
  name: 'bottom',
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
    const tileBottom = mapItem.tiles.find(x => x.name === 'bottom');
    const tileTop = mapItem.tiles.find(x => x.name === 'top');

    const relHeight = hight * direction;
    if (t > speed) {
      wall!.top = tileTop!.bottom = item.state ? hight : hight + relHeight;
      wall!.bottom = tileBottom!.bottom = item.state ? 0 : relHeight;

      return true;
    }

    const s0 = hight / speed;
    const l0 = s0 * t;
    const ds = hight - l0;

    wall!.top = tileTop!.bottom = item.state
      ? direction * ds + hight
      : hight + l0 * direction;
    wall!.bottom = tileBottom!.bottom = item.state
      ? direction * ds
      : l0 * direction;

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
  tiles: [getDoorTopTile(false), getDoorTopTile(true), getDoorBottomTile()],
  stopRay: false
});
