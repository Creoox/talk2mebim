<template>
  <canvas id="xeokit-canvas" class="w-full h-full"></canvas>
</template>

<script setup lang="ts">
const viewerStore = useViewerStore();

onMounted(() => {
  viewerStore.initViewer();
});
</script>

<style>
body {
  margin: 0;
}
/* #xeokit-canvas {
  width: 100vw;
  height: 100vh;
} */
</style>
