import type { GameMap } from '../gameMap/gameMap';
import type Ray from '../ray/ray';
import type { CellHandler } from '../ray/rayHandler';
import type { MovingItem } from '../types';
import { RayAction } from '../types';

export default class MovingItemRayHandler implements CellHandler {
  public item?: MovingItem;
  private gameMap: GameMap;

  constructor(gameMap: GameMap) {
    this.gameMap = gameMap;
  }

  public handle(ray: Ray): RayAction {
    const pos = ray.cellPosition;
    this.item = this.gameMap.findMovingItem(pos.x, pos.y);
    if (this.item) return RayAction.stop;
    return RayAction.continue;
  }
}
