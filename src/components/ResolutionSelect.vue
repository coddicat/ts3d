<script setup lang="ts">
import { ref, watch } from 'vue';
import { resolutionOptions } from '../core/settings';

const resolution = ref(resolutionOptions[0]);
const emit = defineEmits(['update']);
watch(resolution, val => {
  emit('update', val);
});
</script>

<template>
  <select class="resolution" v-model="resolution">
    <option v-for="(option, $i) in resolutionOptions" :key="$i" :value="option">
      {{ option[0] }}x{{ option[1] }}
    </option>
  </select>
</template>

<style>
.resolution {
  width: 110px;
}
</style>
