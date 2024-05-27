import type { GameMap } from '../gameMap/gameMap';
import type Ray from '../ray/ray';
import type { CellHandler } from '../ray/rayHandler';
import { RayAction } from '../types';
import type PlayerState from './playerState';

const stairsHeight = 0.301;

export default class CollisionHandler implements CellHandler {
  private state: PlayerState;
  private gameMap: GameMap;

  constructor(state: PlayerState, gameMap: GameMap) {
    this.state = state;
    this.gameMap = gameMap;
  }

  private checkMoveCollision(x: number, y: number): RayAction {
    const item = this.gameMap.check(x, y);
    const walls = item.walls;

    if (!item || !walls.length) return RayAction.continue;

    const state = this.state;
    const pos = state.position;
    const userBottom = pos.z;
    const userTop = userBottom + state.height;

    let stepZ = userBottom;

    for (const wall of walls) {
      const top = wall.top;
      if (wall.bottom >= userTop || top <= userBottom) continue;

      if (top <= userBottom + stairsHeight) {
        stepZ = Math.max(stepZ, top);
        continue;
      }

      return RayAction.stop;
    }

    if (pos.z != stepZ) {
      // //TODO extract to method
      // pos.z = stepZ;
      // state.lookZ = stepZ + state.lookHeight;
      // state.top = stepZ + state.height;

      state.setZ(stepZ, false);
      state.timestamp++;
    }

    return RayAction.continue;
  }

  public handle(ray: Ray): RayAction {
    const pos = ray.cellPosition;

    return pos.x <= 0 || pos.y <= 0
      ? RayAction.stop
      : this.checkMoveCollision(pos.x, pos.y);
  }
}
