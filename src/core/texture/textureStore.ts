import { TextureData } from './textureData';

export enum TextureType {
  RoomWall,
  RoomFloor,
  RoomCeil,

  CoridorCeil,
  CoridorWall,

  TunnelWall,

  BasementFloor,
  BasementWall,

  Numbers,
  Banan,
  Wood,
  Parquet,
  Sand,

  DoorAbove,
  DoorTop,
  DoorBottom,
  DoorTile,
  CaptainDoor,

  Welcome,
  Window,
  Aim,
  Console11,
  Console12,
  Console13,
  Console21,
  Console22,
  Console23,
  Sky,
  Tech,

  DukeFront,
  DukeBack,
  DukeSide
}

const textureFiles = new Map<TextureType, string>([
  [TextureType.RoomWall, './textures/roomWall.png'],
  [TextureType.RoomFloor, './textures/roomFloor.png'],
  [TextureType.RoomCeil, './textures/roomCeil.png'],

  [TextureType.CoridorCeil, './textures/coridorCeil.png'],
  [TextureType.CoridorWall, './textures/coridorWall.png'],

  [TextureType.BasementFloor, './textures/basementFloor.png'],

  [TextureType.TunnelWall, './textures/tunnelWall.png'],

  [TextureType.DukeFront, './textures/dukeFront.png'],
  [TextureType.DukeBack, './textures/dukeBack.png'],
  [TextureType.DukeSide, './textures/dukeSide.png'],

  [TextureType.BasementWall, './textures/basementWall.png'],

  [TextureType.Wood, './textures/wood.png'],

  [TextureType.Numbers, './textures/numbers.png'],
  [TextureType.Banan, './textures/banan.png'],
  [TextureType.Parquet, './textures/parquet.png'],
  [TextureType.Sand, './textures/sand.png'],

  [TextureType.DoorAbove, './textures/doorAbove.png'],
  [TextureType.DoorTop, './textures/doorTop.png'],
  [TextureType.DoorBottom, './textures/doorBottom.png'],
  [TextureType.DoorTile, './textures/doorTile.png'],
  [TextureType.CaptainDoor, './textures/captainDoor.png'],

  [TextureType.Welcome, './textures/welcome.png'],

  [TextureType.Window, './textures/window.png'],
  [TextureType.Aim, './textures/aim.png'],
  [TextureType.Console11, './textures/console_11.png'],
  [TextureType.Console12, './textures/console_12.png'],
  [TextureType.Console13, './textures/console_13.png'],
  [TextureType.Console21, './textures/console_21.png'],
  [TextureType.Console22, './textures/console_22.png'],
  [TextureType.Console23, './textures/console_23.png'],

  [TextureType.Sky, './textures/sky.png'],
  [TextureType.Tech, './textures/tech.png']
]);

const store = {
  map: null as null | Map<TextureType, TextureData>
};

async function loadTexture(url: string): Promise<TextureData> {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const img = new Image();
  img.src = url;
  return new Promise<TextureData>((resolve, reject) => {
    img.onerror = function (e: Event | string) {
      console.error(`failed load ${url}`);
      reject(e);
    };
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw 'Unable to get context';
      }

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = new Uint32Array(imageData.data.buffer);
      resolve(new TextureData(img.width, img.height, data, canvas));
    };
  });
}

async function loadTextures(): Promise<Map<TextureType, TextureData>> {
  const items = [...textureFiles.entries()];
  const promises = items.map(async x => {
    const data = await loadTexture(x[1]);
    return { type: x[0], data };
  });
  const res = await Promise.all(promises);
  return new Map<TextureType, TextureData>(res.map(x => [x.type, x.data]));
}

export default {
  async init(): Promise<void> {
    store.map = await loadTextures();
  },
  getTextureData(type: TextureType): TextureData | null {
    return store.map?.get(type) ?? null;
  }
};
