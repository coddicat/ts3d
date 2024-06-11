import settings from '../settings';
import SpriteObject from '../sprite/spriteObject';
import type { TextureType } from '../texture/textureStore';
import type { Vector3D } from '../types';

const pi2 = Math.PI * 2;
export default class PlayerState extends SpriteObject {
  //object props
  public timestamp = 0;
  public halfWidth: number = settings.playerWidth / 2;
  public width: number = settings.playerWidth;
  public height: number = settings.playerHeight;
  public halfHeight: number = settings.playerHeight / 2;
  public lookHeight: number = settings.playerHeight * 0.8;
  public lookZ = settings.playerHeight * 0.8;
  public top = settings.playerHeight;
  public cos = 0;
  public sin = 0;
  public angle_pi2 = 0;

  public life = 100;

  constructor(
    position: Vector3D,
    size: { width: number; height: number },
    textureTypes: TextureType[],
    repeat: number
  ) {
    super(position, size, textureTypes, repeat);
    this.setAngle(position.angle);
    this.setZ(position.z);
  }

  public lookVertical = 0;
  public halfLookVertical = settings.halfHeight;

  public speedZ = 0;

  public setZ(value: number): void {
    this.position.z = value;
    this.lookZ = this.position.z + this.lookHeight;
    this.top = this.position.z + this.height;

    //TODO check if need to change also when moving
    this.timestamp++;
  }

  public setAngle(value: number): void {
    this.position.angle = value;
    this.cos = Math.cos(value);
    this.sin = Math.sin(value);
    this.angle_pi2 = value / pi2;
  }

  public dead() {
    //TODO
    alert('dead');
    const startPos = settings.getPlayerStartPosition();
    this.position.x = startPos.x;
    this.position.y = startPos.y;
    this.position.z = startPos.z;
    this.position.angle = startPos.angle;
    this.setAngle(this.position.angle);
    this.setZ(this.position.z);
    this.life = 100;
  }
}
