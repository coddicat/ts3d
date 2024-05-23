export enum MapItemType {
  Empty,
  CoridorSpace,
  LowCoridorSpace,
  BasementSpace,
  WallCoridor,
  LowWallCoridor,
  RoomSpace,
  BridgeSpace,
  WallMetal,
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
  Window
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
  ['@', MapItemType.WallMetal],
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
  ['O', MapItemType.Window]
]);
