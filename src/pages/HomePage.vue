<template>
  <div class="home">
    <div class="settings">
      <label>
        <span>fps: {{ fpsDisplay }}</span>
      </label>
      <div style="display: flex; flex-direction: row; gap: 2px">
        <ResolutionSelect @update="updateResolution" />
        <button @click="fullscreen">fullscreen</button>
      </div>
    </div>
    <div class="wrapper">
      <canvas width="640" height="360" class="canvas" ref="canvasRef"></canvas>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import ResolutionSelect from '../components/ResolutionSelect.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { Game } from '../core/game';
import { CanvasHandler } from '../core/canvasHandler';
import { FpsHandler } from '../core/fpsHandler';

const canvasRef = ref(null as HTMLCanvasElement | null);
const fpsDisplay = ref(0);
const stopped = ref(false);
let animationFrame = 0;

const fpsHandler = new FpsHandler();
const game = new Game();
let canvasHandler: CanvasHandler;

async function tick(timestamp: number) {
  if (stopped.value) return;
  game.tick(timestamp);
  canvasHandler?.handle();
  fpsDisplay.value = fpsHandler.getFps(timestamp);
  animationFrame = window.requestAnimationFrame(tick);
}
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
  if (!canvasRef.value) throw 'no canvas';
  const canvas = canvasRef.value;
  canvas.requestFullscreen();
}

onMounted(async () => {
  if (!canvasRef.value) throw 'no canvas';
  const canvas = canvasRef.value;

  canvas.onclick = () => {
    canvas.requestPointerLock();
  };
  canvas.onmousemove = (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) return;
    game.HandleMouse(e);
  };

  canvasHandler = new CanvasHandler(canvas);
  await game.init();

  start();
});

onUnmounted(() => {
  stop();
  game.destroy();
});

function updateResolution(resolution: number[]) {
  game.changedResolution(resolution[0], resolution[1]);
  canvasHandler = new CanvasHandler(canvasRef.value!);
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas {
  border: 1px black solid;
  background-color: #000;
  width: 854px;
  height: 480px;
}
.resolution {
  width: 200px;
}
.settings {
  margin-left: -90px;
  margin-right: 10px;
  width: 200px;
}
.wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}
</style>
