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
  DoorLevel,
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

const href = (path: string): string => new URL(path, import.meta.url).href;

const textureFiles = new Map<TextureType, string>([
  [TextureType.RoomWall, href('../../assets/roomWall.png')],
  [TextureType.RoomFloor, href('../../assets/roomFloor.png')],
  [TextureType.RoomCeil, href('../../assets/roomCeil.png')],

  [TextureType.CoridorCeil, href('../../assets/coridorCeil.png')],
  [TextureType.CoridorWall, href('../../assets/coridorWall.png')],

  [TextureType.BasementFloor, href('../../assets/basementFloor.png')],

  [TextureType.TunnelWall, href('../../assets/tunnelWall.png')],

  [TextureType.DukeFront, href('../../assets/dukeFront.png')],
  [TextureType.DukeBack, href('../../assets/dukeBack.png')],
  [TextureType.DukeSide, href('../../assets/dukeSide.png')],

  [TextureType.BasementWall, href('../../assets/basementWall.png')],

  [TextureType.Wood, href('../../assets/wood.png')],

  [TextureType.Numbers, href('../../assets/numbers.png')],
  [TextureType.Banan, href('../../assets/banan.png')],
  [TextureType.Parquet, href('../../assets/parquet.png')],
  [TextureType.Sand, href('../../assets/sand.png')],

  [TextureType.DoorAbove, href('../../assets/doorAbove.png')],
  [TextureType.DoorTop, href('../../assets/doorTop.png')],
  [TextureType.DoorBottom, href('../../assets/doorBottom.png')],
  [TextureType.DoorLevel, href('../../assets/doorLevel.png')],
  [TextureType.CaptainDoor, href('../../assets/captainDoor.png')],

  [TextureType.Welcome, href('../../assets/welcome.png')],

  [TextureType.Window, href('../../assets/window.png')],
  [TextureType.Aim, href('../../assets/aim.png')],
  [TextureType.Console11, href('../../assets/console_11.png')],
  [TextureType.Console12, href('../../assets/console_12.png')],
  [TextureType.Console13, href('../../assets/console_13.png')],
  [TextureType.Console21, href('../../assets/console_21.png')],
  [TextureType.Console22, href('../../assets/console_22.png')],
  [TextureType.Console23, href('../../assets/console_23.png')],

  [TextureType.Sky, href('../../assets/sky.png')],
  [TextureType.Tech, href('../../assets/tech.png')]
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
