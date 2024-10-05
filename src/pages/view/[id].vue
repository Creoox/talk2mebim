<template>
  <Splitter class="h-screen !border-0">
    <SplitterPanel class="flex items-center justify-center" :size="75" :minSize="10">
      <div class="relative w-full h-full">
        <Logo class="absolute top-1 left-1" />
        <XeokitViewer />
      </div>
    </SplitterPanel>

    <SplitterPanel class="flex items-center justify-center" :size="25">
      <Chat />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
const chatStore = useChatStore();
const route = useRoute();

const { resume, pause } = useIntervalFn(() => {
  chatStore.load(route.params.id as string);
}, 1000);

onMounted(() => {
  chatStore.load(route.params.id as string);
  resume();
});

onUnmounted(() => {
  pause();
});
</script>
