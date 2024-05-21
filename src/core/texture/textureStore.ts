import { TextureData } from './textureData';

export enum TextureType {
  FloorMetal,
  FloorNumber,
  WallBriks,
  DukeFront,
  DukeBack,
  DukeSide,
  Banan,
  WallWood,
  Parquet,
  Ground,
  Sand,
  Door,
  WelcomeWall,
  Ceil,
  Window,
  Aim,
  Sky,
}

const href = (path: string): string => new URL(path, import.meta.url).href;

const textureFiles = new Map<TextureType, string>([
  [TextureType.FloorMetal, href('../../assets/floor2.png')],
  [TextureType.DukeFront, href('../../assets/duke_front.png')],
  [TextureType.DukeBack, href('../../assets/duke_back.png')],
  [TextureType.DukeSide, href('../../assets/duke_side.png')],
  [TextureType.WallBriks, href('../../assets/wall_briks.png')],
  [TextureType.WallWood, href('../../assets/wall_wood.png')],
  [TextureType.FloorNumber, href('../../assets/floor1.png')],
  [TextureType.Banan, href('../../assets/banan.png')],
  [TextureType.Parquet, href('../../assets/parquet.png')],
  [TextureType.Ground, href('../../assets/ground.png')],
  [TextureType.Door, href('../../assets/door.png')],
  [TextureType.WelcomeWall, href('../../assets/welcome_wall.png')],
  [TextureType.Ceil, href('../../assets/ceil.png')],
  [TextureType.Sand, href('../../assets/sand.png')],
  [TextureType.Window, href('../../assets/window.png')],
  [TextureType.Aim, href('../../assets/aim.png')],
  [TextureType.Sky, href('../../assets/sky.png')],
]);

const store = {
  map: null as null | Map<TextureType, TextureData>,
};

async function loadTexture(url: string): Promise<TextureData> {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const img = new Image();
  img.src = url;
  return new Promise<TextureData>((resolve, reject) => {
    img.onerror = function(e: Event | string) {
      reject(e);
    }
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
  const promises = items.map(async (x) => {
    const data = await loadTexture(x[1]);
    return { type: x[0], data };
  });
  const res = await Promise.all(promises);
  return new Map<TextureType, TextureData>(res.map((x) => [x.type, x.data]));
}

export default {
  async init(): Promise<void> {
    store.map = await loadTextures();
  },
  getTextureData(type: TextureType): TextureData | null {
    return store.map?.get(type) ?? null;
  },
};
