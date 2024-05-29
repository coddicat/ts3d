import type { GameMap } from './gameMap/gameMap';
import type Player from './player/player';

export class KeyHandler {
  private activeKeys = new Map<string, boolean>();
  private player: Player;
  private gameMap: GameMap;

  constructor(player: Player, gameMap: GameMap) {
    this.player = player;
    this.gameMap = gameMap;

    window.onkeydown = (e: KeyboardEvent) => {
      this.activeKeys.set(e.code, true);
    };
    window.onkeyup = (e: KeyboardEvent) => {
      this.activeKeys.set(e.code, false);
    };
  }

  public destroy() {
    window.onkeydown = null;
    window.onkeyup = null;
  }

  public handle(timestamp: number): void {
    const up = this.activeKeys.get('ArrowUp') || this.activeKeys.get('KeyW');
    const down =
      this.activeKeys.get('ArrowDown') || this.activeKeys.get('KeyS');
    const moveLeft = this.activeKeys.get('KeyA');
    const moveRight = this.activeKeys.get('KeyD');
    const enter =
      this.activeKeys.get('Enter') || this.activeKeys.get('NumpadEnter');

    if (enter) {
      const item = this.player.checkMovingItem();
      if (item) this.gameMap.toggleMovingItem(item, timestamp);
    }

    this.player.handleMove(
      up ? 1 : down ? -1 : 0,
      moveRight ? 1 : moveLeft ? -1 : 0
    );

    if (this.activeKeys.get('Space')) {
      this.player.jump();
    }
  }
}
