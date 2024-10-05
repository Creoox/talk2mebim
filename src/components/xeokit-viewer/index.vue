<template>
  <canvas id="xeokit-canvas" class="w-screen h-screen"></canvas>
</template>

<script setup lang="ts">
const urlValue = ref('');
const viewerStore = useViewerStore();

onMounted(() => {
  viewerStore.initViewer();
  const url = 'https://sos-ch-gva-2.exo.io/creoox-public/example-no-1.xkt';
  viewerStore.loadModelFromXeovisionURL(url);
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
