import TextureSet from '../../texture/textureSet';
import { TextureType } from '../../texture/textureStore';

export default (repeatX: number, startX: number, startY: number) => ({
  walls: [
    {
      color: 0xc8c8dc,
      top: 2.8,
      bottom: 0,
      render: true,
      texture: new TextureSet(
        TextureType.WallCoridor,
        1.3,
        startX,
        startY,
        5,
        false
      )
    }
  ],
  levels: [],
  stopRay: false
});
