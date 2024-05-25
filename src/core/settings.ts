const rad = Math.PI / 180;
//const lookAngleDegrees = 60;

const settings = {
  resolution: {
    width: 640,
    height: 360
  },
  moveSpeed: 0.006,
  turnSpeed: 0.001,
  playerHeight: 1.8,
  playerWidth: 1.34,
  maxLookVertical: 0,
  levelTexture: true,
  wallTexture: true,

  lookLength: 0,
  lookAngle: 0,
  lookMapStep: 0,
  halfHeight: 0,
  halfWidth: 0,
  maxLightFact: 0,
  maxBottom: 0,
  halfLookAngle: 0,
  buf8: new Uint8ClampedArray(),
  data: new Uint32Array(),
  angleStep: 0,
  planeDistance: 0,
  angles: [] as number[]
};

export function setLookLength(length: number): void {
  settings.lookLength = length;
  settings.maxLightFact = 255 / length;
}

export function setResolution(width: number, height: number): void {
  settings.resolution.width = width;
  settings.resolution.height = height;
  settings.halfWidth = width / 2;
  settings.halfHeight = height / 2;
  settings.maxBottom = height - 1;
  const buf = new ArrayBuffer(height * width * 4);
  settings.buf8 = new Uint8ClampedArray(buf);
  settings.data = new Uint32Array(buf);
  settings.angleStep = settings.lookAngle / width;
  settings.planeDistance =
    settings.halfWidth / Math.tan(settings.halfLookAngle);
  settings.maxLookVertical = settings.resolution.height * 0.625;
  calculateAngles();
}

function setLookAngle(degrees: number): void {
  settings.lookAngle = degrees * rad;
  settings.lookMapStep = (degrees * rad) / 20;
  settings.halfLookAngle = settings.lookAngle / 2;
  settings.angleStep = settings.lookAngle / settings.resolution.width;
}

function calculateAngles(): void {
  for (let x = 0; x < settings.resolution.width; x++) {
    const offset = x - settings.halfWidth;
    const angle = Math.atan(offset / settings.planeDistance);
    settings.angles[x] = angle;
  }
}

setLookLength(80);
setLookAngle(83);
setResolution(640, 360);

export default settings;
