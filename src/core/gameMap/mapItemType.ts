export enum MapItemType {
  Empty,
  CoridorSpace,
  LowCoridorSpace,
  BasementSpace,
  WallCoridor,
  LowWallCoridor,
  RoomSpace,
  BridgeSpace,
  WallMain,
  WelcomeWall,
  Stair0,
  Stair1,
  Stair2,
  Stair3,
  Stair4,
  Stair5,
  Stair6,
  Stair7,
  Mirror,
  Door,
  Number,
  Window,
  Panorama,
  Shelfs,
  Box,
  Console11,
  Console12,
  Console13,
  Console21,
  Console22,
  Console23
}

//export const movingItemTypes = [MapItemType.Door, MapItemType.Platform];

export const mapItemTypeKeys = new Map<string, MapItemType>([
  ['.', MapItemType.RoomSpace],
  [',', MapItemType.CoridorSpace],
  ['_', MapItemType.LowCoridorSpace],
  ['~', MapItemType.BasementSpace],
  ['-', MapItemType.BridgeSpace],
  ['#', MapItemType.WallCoridor],
  ['%', MapItemType.LowWallCoridor],
  ['@', MapItemType.WallMain],
  ['0', MapItemType.Stair0],
  ['1', MapItemType.Stair1],
  ['2', MapItemType.Stair2],
  ['3', MapItemType.Stair3],
  ['4', MapItemType.Stair4],
  ['5', MapItemType.Stair5],
  ['6', MapItemType.Stair6],
  ['7', MapItemType.Stair7],
  ['M', MapItemType.Mirror],
  ['D', MapItemType.Door],
  ['W', MapItemType.WelcomeWall],
  ['N', MapItemType.Number],
  ['O', MapItemType.Window],
  ['P', MapItemType.Panorama],
  ['S', MapItemType.Shelfs],
  ['B', MapItemType.Box],

  ['╔', MapItemType.Console11], //201
  ['╩', MapItemType.Console12], //202
  ['╦', MapItemType.Console13], //203
  ['╠', MapItemType.Console21], //204
  ['═', MapItemType.Console22], //205
  ['╬', MapItemType.Console23] //206
]);
