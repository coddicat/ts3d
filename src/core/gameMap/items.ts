import type { MapItem, MovingItemProps } from '../types';
import { MapItemType } from './mapItemType';
import Door, { doorMovingItemProps } from './items/door';
import WelcomeWall from './items/welcome';
import CoridorWall from './items/wallCoridor';
// import Platform, { platformMovingItemProps } from './items/platform';
import Stairs from './items/stairs';
// import Shelfs from './items/shelfs';
import {
  roomItem,
  bridgeItem,
  numberItem,
  coridor,
  lowCoridor,
  basementSpace
} from './items/basic';
import Walls from './items/walls';
//import Ledges from './items/ledges';
import Mirror from './items/mirror';

export const singleItems = new Map<MapItemType, MapItem>([
  [MapItemType.CoridorSpace, coridor],
  [MapItemType.LowCoridorSpace, lowCoridor],
  [MapItemType.BasementSpace, basementSpace],
  //[MapItemType.Shelfs, Shelfs],
  [MapItemType.RoomSpace, roomItem],
  [MapItemType.BridgeSpace, bridgeItem],
  [MapItemType.Number, numberItem],
  ...Walls.entries(),
  ...Stairs.entries(),
  // ...Ledges.entries(),

  [MapItemType.Mirror, Mirror]
]);

export type ItemSetGetter = (
  repeatX: number,
  startX: number,
  startY: number
) => MapItem;

export const itemsInSet = new Map<MapItemType, ItemSetGetter>([
  [MapItemType.WelcomeWall, WelcomeWall],
  [MapItemType.WallCoridor, CoridorWall],
  [MapItemType.Door, Door]
  // [MapItemType.Platform, Platform]
]);

export const movingTypes = new Map<MapItemType, MovingItemProps>([
  [MapItemType.Door, doorMovingItemProps]
  // [MapItemType.Platform, platformMovingItemProps]
]);
