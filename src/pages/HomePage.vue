<template>
  <div class="home">
    <div class="settings">
      <button v-if="started" @click="stop">Stop</button>
      <button v-else @click="start">Start</button>

      <ResolutionSelect @update="updateResolution" />
      <button
        :disabled="!started || !isFullscreenSupported()"
        @click="fullscreen"
      >
        Fullscreen
      </button>
    </div>

    <canvas
      v-show="started"
      width="640"
      height="360"
      class="canvas"
      ref="canvasRef"
    >
    </canvas>
    <div>
      <Joystick
        style="position: fixed; left: 35px; bottom: 35px"
        @move="onJoystickMove"
        @stop="onJoystickMove"
        @start="onJoystickMove"
      />
      <Joystick
        style="position: fixed; right: 35px; bottom: 35px"
        @move="onJoystickLook"
        @stop="onJoystickLook"
        @start="onJoystickLook"
      />
    </div>
    <div v-show="!started">
      <Disclaimer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ResolutionSelect from '../components/ResolutionSelect.vue';
import Disclaimer from './Disclaimer.vue';
import type { JoystickComponent } from 'vue-joystick-component';
import Joystick from 'vue-joystick-component';

import { onMounted, onUnmounted, ref } from 'vue';
import { Game } from '../core/game';
import { CanvasHandler } from '../core/handlers/canvasHandler';

const canvasRef = ref(null as HTMLCanvasElement | null);
const started = ref(false);
let animationFrame = 0;

const game = new Game();
let canvasHandler: CanvasHandler;

async function tick(timestamp: number) {
  if (!started.value) return;
  game.tick(timestamp);
  canvasHandler?.handle(timestamp);
  animationFrame = window.requestAnimationFrame(tick);
}
function start() {
  started.value = true;
  animationFrame = window.requestAnimationFrame(tick);
}
function stop() {
  started.value = false;
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }
}

function isFullscreenSupported() {
  return !!canvasRef.value?.requestFullscreen;
}

function fullscreen() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.requestFullscreen();
}
function onJoystickMove(event: JoystickComponent.UpdateEvent): void {
  game.handleJoystickMove(event);
}
function onJoystickLook(event: JoystickComponent.UpdateEvent): void {
  game.handleJoystickLook(event);
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

  canvasHandler = new CanvasHandler(canvas, game.playerState);

  await game.init();
  //start();
});

onUnmounted(() => {
  stop();
  game.destroy();
});

function updateResolution(resolution: number[]) {
  game.changedResolution(resolution[0], resolution[1]);
  canvasHandler = new CanvasHandler(canvasRef.value!, game.playerState);
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
  flex-direction: row;
  align-items: center;
  gap: 5px;
}
.canvas {
  background-color: #000;
  width: 64vw; //16*4
  height: 36vw; //9*4
  image-rendering: optimizeSpeed;
}

@media (max-width: 1024px) {
  .canvas {
    width: 100vw; //16*4
    height: 56.25vw; //9*4
    max-height: 100vh;
  }
}
</style>
