<template>
  <div class="home">
    <div class="settings">
      <label>
        <span>fps: {{ fpsDisplay }}</span>
      </label>
      <select class="resolution" v-model="resolution">
        <option value="2048,1536">2048x1536</option>
        <option value="1024,768">1024x768</option>
        <option value="800,600">800x600</option>
        <option value="640,480">640x480</option>
        <option value="320,240">320x240</option>
      </select>
      <label
        ><span>Level texture</span
        ><input type="checkbox" v-model="levelTexture" />
      </label>
      <label
        ><span>Wall texture</span
        ><input type="checkbox" v-model="wallTexture" />
      </label>
      <label>
        <span>Fish eye</span>
        <input v-model="fixFact" type="range" min="0" max="1.5" step="0.1" />
      </label>
      <label>
        <span>Distance</span>
        <input v-model="lookLength" type="range" min="20" max="80" step="5" />
      </label>
      <button @click="fullscreen">fullscreen</button>
    </div>
    <div class="main">
      <canvas width="800" height="600" class="canvas" ref="mainCanvas"></canvas>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Player from '../core/player/player';
import PlayerState from '../core/player/playerState';
import { Main3D } from '../core/main3D';
import { mod } from '../core/exts';
import textureStore, { TextureType } from '../core/texture/textureStore';
import SpriteStore from '../core/sprite/spriteStore';
import { GameMap } from '../core/gameMap/gameMap';
import settings, { setLookLength, setResolution } from '../core/settings';

const rad90 = Math.PI / 2;
const playerState = new PlayerState(
  {
    x: 35,
    y: 69,
    z: 0,
    angle: rad90 * 4
  },
  { width: settings.playerWidth, height: settings.playerWidth },
  [TextureType.DukeFront, TextureType.DukeBack, TextureType.DukeSide],
  1
);

const mainCanvas = ref(null as HTMLCanvasElement | null);
const keyMap = new Map<string, boolean>();
const currentKey = ref(keyMap);

const fpsDisplay = ref(0);

let prevTimestamp = 0;
const stopped = ref(false);
const gameMap = new GameMap();
const spriteStore = new SpriteStore(playerState);
const main3D = new Main3D(playerState, gameMap, spriteStore);
const player = new Player(playerState, gameMap);

function keyHandler(timestamp: number): void {
  const up = currentKey.value.get('ArrowUp') || currentKey.value.get('KeyW');
  const down =
    currentKey.value.get('ArrowDown') || currentKey.value.get('KeyS');
  const moveLeft = currentKey.value.get('KeyA');
  const moveRight = currentKey.value.get('KeyD');
  const enter =
    currentKey.value.get('Enter') || currentKey.value.get('NumpadEnter');

  if (enter) {
    const item = player.checkMovingItem();
    if (item) gameMap.toggleMovingItem(item, timestamp);
  }

  player.move(
    timestamp,
    up ? 1 : down ? -1 : 0,
    moveRight ? 1 : moveLeft ? -1 : 0
  );

  const left = currentKey.value.get('ArrowLeft');
  const right = currentKey.value.get('ArrowRight');
  player.turn((left || right) ?? false, timestamp, right ? 1 : left ? -1 : 0);

  if (currentKey.value.get('Space')) {
    player.jump(timestamp);
  }
}

let animationFrame = 0;

async function tick(timestamp: number) {
  if (stopped.value) return;

  if (mod(timestamp | 0, 4) === 0) {
    fpsDisplay.value = (1000 / (timestamp - prevTimestamp)) | 0;
  }

  keyHandler(timestamp);
  gameMap.tickMovingItem(timestamp);
  player.tick(timestamp);
  main3D.renderMain();
  prevTimestamp = timestamp;
  animationFrame = window.requestAnimationFrame(tick);
}

const resolution = ref(
  `${settings.resolution.width},${settings.resolution.height}`
);
const levelTexture = ref(true);
const wallTexture = ref(true);
const fixFact = ref(settings.fixFact);
const lookLength = ref(settings.lookLength);

function start() {
  stopped.value = false;
  animationFrame = window.requestAnimationFrame(tick);
}
function stop() {
  stopped.value = true;
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }
}
function fullscreen() {
  if (!mainCanvas.value) throw 'no canvas';
  const canvas = mainCanvas.value;
  canvas.requestFullscreen();
}
onMounted(async () => {
  window.onkeydown = (e: KeyboardEvent) => {
    currentKey.value.set(e.code, true);
  };
  window.onkeyup = (e: KeyboardEvent) => {
    currentKey.value.set(e.code, false);
  };

  if (!mainCanvas.value) throw 'no canvas';
  const canvas = mainCanvas.value;

  canvas.onclick = () => {
    canvas.requestPointerLock();
  };
  canvas.onmousemove = (ev: MouseEvent) => {
    if (document.pointerLockElement !== canvas) return;

    playerState.position.angle += settings.turnSpeed * ev.movementX;
    playerState.lookVertical -= ev.movementY;
    const max = settings.resolution.height * 0.625;
    if (playerState.lookVertical > max) {
      playerState.lookVertical = max;
    }
    if (playerState.lookVertical < -max) {
      playerState.lookVertical = -max;
    }
    playerState.halfLookVertical =
      settings.halfHeight + playerState.lookVertical;
  };

  await textureStore.init();
  await gameMap.init();
  await spriteStore.init();
  main3D.init(canvas);

  start();
});

onUnmounted(() => {
  window.onkeydown = null;
  window.onkeyup = null;
  stop();
});

watch(resolution, () => {
  const dims = resolution.value.split(',');
  const width = parseInt(dims[0]);
  const height = parseInt(dims[1]);
  setResolution(width, height);
  playerState.halfLookVertical = settings.halfHeight + playerState.lookVertical;

  if (!mainCanvas.value) throw 'no canvas';
  main3D.init(mainCanvas.value);
});
watch(wallTexture, () => {
  settings.wallTexture = wallTexture.value;
});
watch(levelTexture, () => {
  settings.levelTexture = levelTexture.value;
});
watch(fixFact, () => {
  settings.fixFact = fixFact.value;
});
watch(lookLength, () => {
  setLookLength(lookLength.value);
});
</script>
<style lang="scss">
.home {
  display: flex;
  flex-direction: row;
}
.settings {
  display: flex;
  flex-direction: column;
}
.canvas {
  border: 1px black solid;
  background-color: #000;
  flex: 0 0;
}
.resolution {
  width: 200px;
}
.settings {
  margin-left: -90px;
  margin-right: 10px;
  width: 200px;
}
</style>
