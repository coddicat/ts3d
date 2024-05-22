import Texture from '../../texture/texture';
import { TextureType } from '../../texture/textureStore';
import type { MapItem } from '../../types';
import { MapItemType } from '../mapItemType';
//import { ceil } from './basic';

export default new Map<MapItemType, MapItem>([
  // [
  //   MapItemType.TowerWall,
  //   {
  //     walls: [
  //       {
  //         color: 0xcccccc,
  //         top: 10,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       }
  //     ],
  //     levels: [],
  //     stopRay: true
  //   }
  // ],
  // [
  //   MapItemType.TowerWindow1,
  //   {
  //     walls: [
  //       {
  //         color: 0xcccccc,
  //         top: 7,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 10,
  //         bottom: 9,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       }
  //     ],
  //     levels: [
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 7,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       },
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 9,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       }
  //     ],
  //     stopRay: false
  //   }
  // ],
  // [
  //   MapItemType.TowerWindow2,
  //   {
  //     walls: [
  //       {
  //         color: 0xcccccc,
  //         top: 10,
  //         bottom: 4,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 2,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       }
  //     ],
  //     levels: [
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 2,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       },
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 4,
  //         texture: new Texture(TextureType.FloorMetal, 1)
  //       }
  //     ],
  //     stopRay: false
  //   }
  // ],
  // [
  //   MapItemType.Window1,
  //   {
  //     walls: [
  //       {
  //         color: 0xcccccc,
  //         top: 3,
  //         bottom: 1,
  //         render: true,
  //         texture: new Texture(TextureType.Window, 2, true)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 6,
  //         bottom: 5,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 5,
  //         bottom: 3,
  //         render: true,
  //         texture: new Texture(TextureType.WallWood, 1)
  //       },
  //       {
  //         color: 0xcccccc,
  //         top: 1,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallWood, 1)
  //       }
  //     ],
  //     levels: [
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 1,
  //         texture: new Texture(TextureType.Parquet, 1)
  //       },
  //       {
  //         color: 0xdcb9ac,
  //         bottom: 3,
  //         texture: new Texture(TextureType.Parquet, 1)
  //       }
  //     ],
  //     stopRay: false
  //   }
  // ],
  [
    MapItemType.Window,
    {
      walls: [
        {
          color: 0xcccccc,
          top: 2.8,
          bottom: 0.5,
          render: true,
          texture: new Texture(TextureType.Window, 2, true)
        },
        {
          color: 0xcccccc,
          top: 4,
          bottom: 2.8,
          render: true,
          texture: new Texture(TextureType.WallMetal, 1)
        },
        {
          color: 0xcccccc,
          top: 0.8,
          bottom: 0,
          render: true,
          texture: new Texture(TextureType.WallMetal, 1, false, true)
        }
      ],
      levels: [
        {
          color: 0xdcb9ac,
          bottom: 0.8,
          texture: new Texture(TextureType.FloorMetal, 1)
        },
        {
          color: 0xdcb9ac,
          bottom: 2.8,
          texture: new Texture(TextureType.FloorMetal, 1)
        }
      ],
      stopRay: false
    }
  ],
  // [
  //   MapItemType.WallBriks,
  //   {
  //     walls: [
  //       {
  //         color: 0xffffff,
  //         top: 6,
  //         bottom: 0,
  //         render: true,
  //         texture: new Texture(TextureType.WallBriks, 1)
  //       }
  //     ],
  //     levels: [ceil],
  //     stopRay: true
  //   }
  // ],

  [
    MapItemType.WallMetal,
    {
      walls: [
        {
          color: 0xdcc8c8,
          top: 4,
          bottom: 0,
          render: true,
          texture: new Texture(TextureType.WallMetal, 1)
        }
      ],
      levels: [],
      stopRay: true
    }
  ],
  [
    MapItemType.LowWallCoridor,
    {
      walls: [
        {
          color: 0xdcc8c8,
          top: 2.5,
          bottom: 0.2,
          render: true,
          texture: new Texture(TextureType.LowWallCoridor, 1.15)
        }
      ],
      levels: [],
      stopRay: true
    }
  ]
]);
