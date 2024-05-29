import PlayerState from './player/playerState';
import settings, { setResolution } from '../core/settings';
import textureStore, { TextureType } from './texture/textureStore';
import { KeyHandler } from './keyHandler';
import Player from './player/player';
import { GameMap } from './gameMap/gameMap';
import SpriteStore from './sprite/spriteStore';
import { MouseHandler } from './mouseHandler';
import RayCasting from './ray/rayCasting';

const rad90 = Math.PI / 2;

export class Game {
  private playerState = new PlayerState(
    {
      x: 27.5,
      y: 72,
      z: 0,
      angle: rad90 * 3
    },
    { width: settings.playerWidth, height: settings.playerWidth },
    [TextureType.DukeFront, TextureType.DukeBack, TextureType.DukeSide],
    1
  );

  private keyHandler: KeyHandler;
  private mouseHandler: MouseHandler;
  private player: Player;
  private gameMap: GameMap;
  private spriteStore: SpriteStore;
  private rayCasting: RayCasting;

  constructor() {
    this.gameMap = new GameMap();
    this.player = new Player(this.playerState, this.gameMap);
    this.keyHandler = new KeyHandler(this.player, this.gameMap);
    this.spriteStore = new SpriteStore(this.playerState);
    this.mouseHandler = new MouseHandler(this.playerState);

    this.rayCasting = new RayCasting(
      this.playerState,
      this.spriteStore,
      this.gameMap
    );
  }

  public async init(): Promise<void> {
    await textureStore.init();
    await this.gameMap.init();
    await this.spriteStore.init();
  }

  public changedResolution(width: number, height: number) {
    setResolution(width, height);
    this.playerState.halfLookVertical =
      settings.halfHeight + this.playerState.lookVertical;
  }

  public HandleMouse(e: MouseEvent) {
    this.mouseHandler.handler(e);
  }

  public async tick(timestamp: number) {
    this.keyHandler.handle(timestamp);
    this.gameMap.tickMovingItem(timestamp);
    this.player.tick(timestamp);

    this.rayCasting.reset();
    this.rayCasting.draw3D();
  }

  public destroy() {
    this.keyHandler.destroy();
  }
}
