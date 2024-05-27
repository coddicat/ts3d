import type { ItemSetGetter, MapItem, MovingItemProps } from '../types';
import { MapItemType } from './mapItemType';
import { doorWall, doorMovingItemProps } from './items/door';
import { welcomeWall } from './items/welcome';
import { coridorSpace, coridorWall } from './items/coridor';
import { roomSpace, basementSpace, roomWall } from './items/basic';
import { techWall } from './items/tech';
import { windowWall } from './items/window';
import { stairs } from './items/stairs';
import { shelfsSpace } from './items/shelfs';
import { console } from './items/console';
import { bridgeSpace } from './items/bridge';
import { tunnelSpace, tunnelWall } from './items/tunnel';
import { numberSpace } from './items/number';
import { panoramaWall } from './items/panorama';
import { mirrorWall } from './items/mirror';

export const singleItems = new Map<MapItemType, MapItem>([
  [MapItemType.BasementSpace, basementSpace],
  [MapItemType.ShelfsSpace, shelfsSpace],
  [MapItemType.RoomSpace, roomSpace],
  [MapItemType.BridgeSpace, bridgeSpace],
  [MapItemType.NumberSpace, numberSpace],
  [MapItemType.TunnelWall, tunnelWall],
  ...stairs.entries(),
  ...console.entries()
]);

export const itemsInSet = new Map<MapItemType, ItemSetGetter>([
  [MapItemType.CoridorSpace, coridorSpace],
  [MapItemType.CoridorWall, coridorWall],
  [MapItemType.TunnelSpace, tunnelSpace],
  [MapItemType.WelcomeWall, welcomeWall],
  [MapItemType.RoomWall, roomWall],
  [MapItemType.TechWall, techWall],
  [MapItemType.WindowWall, windowWall],
  [MapItemType.PanoramaWall, panoramaWall],
  [MapItemType.DoorWall, doorWall],
  [MapItemType.MirrorWall, mirrorWall]
]);

export const movingTypes = new Map<MapItemType, MovingItemProps>([
  [MapItemType.DoorWall, doorMovingItemProps]
]);
