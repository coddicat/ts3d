import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { MapItemType } from '../mapItemType';

export default new Map<MapItemType, MapItem>([
  // [
  //   MapItemType.Window,
  //   {
  //     walls: [
  //       {
  //         color: 0xcccccc,
  //         top: 2.8,
  //         bottom: 0.5,
  //         render: true,
  //         texture: new Texture(TextureType.Window, 2, true)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 3.5,
  //         bottom: 2.8,
  //         render: true,
  //         texture: new Texture(TextureType.WallMetal, 1)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 0.8,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallMetal, 1, false, true)
  //       },
  //       {
  //         color: 0xdcc8c8,
  //         top: 0,
  //         bottom: -2.4,
  //         render: true,
  //         texture: new Texture(TextureType.WallBasement, 2.4)
  //       }
  //     ],
  //     levels: [
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 0.8,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       },
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 2.8,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       }
  //     ],
  //     stopRay: false
  //   }
  // ],
  // [
  //   MapItemType.WallMain,
  //   {
  //     walls: [
  //       {
  //         color: 0xdcc8c8,
  //         top: 3.5,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallMain, 3.5)
  //       },
  //       {
  //         color: 0xdcc8c8,
  //         top: 0,
  //         bottom: -2.4,
  //         render: true,
  //         texture: new Texture(TextureType.WallBasement, 2.4)
  //       }
  //     ],
  //     levels: [],
  //     stopRay: true
  //   }
  // ],
  [
    MapItemType.LowWallCoridor,
    {
      walls: [
        {
          color: 0xdcc8c8,
          top: 2.5,
          bottom: 0,
          render: true,
          texture: new Texture(TextureType.LowWallCoridor, 1.25)
        }
      ],
      levels: [],
      stopRay: true
    }
  ]
]);
