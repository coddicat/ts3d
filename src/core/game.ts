import PlayerState from './player/playerState';
import settings, { setResolution } from '../core/settings';
import textureStore, { TextureType } from './texture/textureStore';
import { KeyHandler } from './handlers/keyHandler';
import Player from './player/player';
import { GameMap } from './gameMap/gameMap';
import SpriteStore from './sprite/spriteStore';
import { MouseHandler } from './handlers/mouseHandler';
import RayCasting from './ray/rayCasting';
import type { JoystickComponent } from 'vue-joystick-component';

export class Game {
  public playerState = new PlayerState(
    settings.getPlayerStartPosition(),
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
    this.spriteStore = new SpriteStore(this.playerState);
    this.gameMap = new GameMap(this.spriteStore);
    this.player = new Player(this.playerState, this.gameMap);
    this.keyHandler = new KeyHandler(this.player, this.gameMap);
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

    this.keyHandler.init();
    this.rayCasting.init();
  }

  public changedResolution(width: number, height: number) {
    setResolution(width, height);
    this.playerState.halfLookVertical =
      settings.halfHeight + this.playerState.lookVertical;
    this.rayCasting.init();
  }

  public HandleMouse(e: MouseEvent) {
    this.mouseHandler.handler(e.movementX, e.movementY);
  }

  private joystickForward = 0;
  private joystickRight = 0;
  private joystickMove = false;
  public handleJoystickMove(event: JoystickComponent.UpdateEvent): void {
    this.joystickMove = event.type !== 'stop';
    this.joystickForward = event.y ?? 0;
    this.joystickRight = event.x ?? 0;
  }

  private joystickLookX = 0;
  private joystickLookY = 0;
  private joystickLook = false;
  public handleJoystickLook(event: JoystickComponent.UpdateEvent): void {
    this.joystickLook = event.type !== 'stop';
    this.joystickLookY = settings.JoystickLookYSpeed * (event.y ?? 0);
    this.joystickLookX = settings.JoystickLookXSpeed * (event.x ?? 0);
  }

  public async tick(timestamp: number) {
    if (this.joystickMove) {
      this.player.handleMove(this.joystickForward, this.joystickRight);
    } else {
      this.keyHandler.handle(timestamp);
    }

    if (this.joystickLook) {
      this.mouseHandler.handler(this.joystickLookX, this.joystickLookY);
    }

    this.gameMap.tickMovingItem(timestamp);
    this.player.tick(timestamp);

    this.rayCasting.reset();
    this.rayCasting.draw3D();
  }

  public destroy() {
    this.keyHandler.destroy();
  }
}
