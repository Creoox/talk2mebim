<template>
  <Panel :class="who === 'ai' ? 'mr-6' : 'ml-6'" v-if="who !== 'system'">
    <template #header>
      {{ props.who }}
    </template>

    <p class="m-0" v-html="marked.parse(props.text)"></p>
  </Panel>
</template>

<style scoped>
.p-panel {
  background-color: v-bind(color);
}
</style>

<script setup lang="ts">
import { marked } from 'marked';

interface Props {
  text: string;
  who: string;
}

const color = computed(() => {
  return props.who === 'ai' ? '#474747' : '#2b4053';
});

const props = defineProps<Props>();
</script>
