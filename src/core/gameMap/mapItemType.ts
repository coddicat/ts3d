export enum MapItemType {
  Empty,

  RoomSpace,
  RoomWall,

  CoridorSpace,
  CoridorWall,

  TunnelSpace,
  TunnelWall,

  BasementSpace,
  BridgeSpace,

  MirrorWall,
  WindowWall,
  PanoramaWall,

  DoorWall,
  TechWall,
  WelcomeWall,

  ShelfsSpace,
  NumberSpace,

  StairSpace0,
  StairSpace1,
  StairSpace2,
  StairSpace3,
  StairSpace4,
  StairSpace5,
  StairSpace6,
  StairSpace7,

  ConsoleSpace11,
  ConsoleSpace12,
  ConsoleSpace13,
  ConsoleSpace21,
  ConsoleSpace22,
  ConsoleSpace23
}

export const mapItemTypeKeys = new Map<string, MapItemType>([
  ['.', MapItemType.RoomSpace],
  ['@', MapItemType.RoomWall],

  [',', MapItemType.CoridorSpace],
  ['#', MapItemType.CoridorWall],

  ['_', MapItemType.TunnelSpace],
  ['%', MapItemType.TunnelWall],

  ['~', MapItemType.BasementSpace],
  ['-', MapItemType.BridgeSpace],

  ['M', MapItemType.MirrorWall],
  ['D', MapItemType.DoorWall],
  ['W', MapItemType.WelcomeWall],
  ['O', MapItemType.WindowWall],
  ['P', MapItemType.PanoramaWall],
  ['T', MapItemType.TechWall],
  ['S', MapItemType.ShelfsSpace],
  ['N', MapItemType.NumberSpace],

  ['0', MapItemType.StairSpace0],
  ['1', MapItemType.StairSpace1],
  ['2', MapItemType.StairSpace2],
  ['3', MapItemType.StairSpace3],
  ['4', MapItemType.StairSpace4],
  ['5', MapItemType.StairSpace5],
  ['6', MapItemType.StairSpace6],
  ['7', MapItemType.StairSpace7],

  ['╔', MapItemType.ConsoleSpace11], //201
  ['╩', MapItemType.ConsoleSpace12], //202
  ['╦', MapItemType.ConsoleSpace13], //203
  ['╠', MapItemType.ConsoleSpace21], //204
  ['═', MapItemType.ConsoleSpace22], //205
  ['╬', MapItemType.ConsoleSpace23] //206
]);
