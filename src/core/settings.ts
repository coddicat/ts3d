import type { Vector3D } from './types';

const rad = Math.PI / 180;
const pi2 = Math.PI * 2;
const rad90 = Math.PI / 2;

export const resolutionOptions = [
  [640, 360],
  [854, 480],
  [960, 540],
  [1024, 576],
  [1280, 720],
  [1920, 1080]
];

const settings = {
  getPlayerStartPosition: (): Vector3D => ({
    x: 27.5,
    y: 72,
    z: 0,
    angle: rad90 * 3
  }),

  resolutionWidth: 0,
  resolutionHeight: 0,
  moveSpeed: 0.006,
  turnSpeed: 0.001,
  JoystickLookXSpeed: 50,
  JoystickLookYSpeed: -10,
  playerHeight: 1.8,
  playerWidth: 1.34,
  stairsTollerance: 0.4,
  maxLookVertical: 0,

  lookLength: 0,
  HFOV: 0,
  halfHeight: 0,
  halfWidth: 0,
  maxLightFact: 0,
  maxBottom: 0,
  halfHFOV: 0,
  buf8: new Uint8ClampedArray(),
  data: new Uint32Array(),
  angleStep: 0,
  planeDistance: 0,
  angles: [] as number[],
  angleStep_pi2: 0
};

export function setResolution(width: number, height: number): void {
  settings.resolutionWidth = width;
  settings.resolutionHeight = height;
  settings.halfWidth = width / 2;
  settings.halfHeight = height / 2;
  settings.maxBottom = height - 1;
  const buf = new ArrayBuffer(height * width * 4);
  settings.buf8 = new Uint8ClampedArray(buf);
  settings.data = new Uint32Array(buf);
  settings.angleStep = settings.HFOV / width;
  settings.planeDistance = settings.halfWidth / Math.tan(settings.halfHFOV);
  settings.maxLookVertical = height * 0.625;
  settings.angleStep_pi2 = settings.angleStep / pi2;
  calculateAngles();
}

function setLookLength(length: number): void {
  settings.lookLength = length;
  settings.maxLightFact = 255 / length;
}

function setHFOV(degrees: number): void {
  settings.HFOV = degrees * rad;
  settings.halfHFOV = settings.HFOV / 2;
}

function calculateAngles(): void {
  for (let x = 0; x < settings.resolutionWidth; x++) {
    const offset = x - settings.halfWidth;
    const angle = Math.atan(offset / settings.planeDistance);
    settings.angles[x] = angle;
  }
}

setLookLength(70);
setHFOV(83);
setResolution(resolutionOptions[0][0], resolutionOptions[0][1]);

export default settings;
