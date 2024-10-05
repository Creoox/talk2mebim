<template>
  <Panel>
    <template #header>
      {{ props.who }}
    </template>

    <p class="m-0">
      {{ props.text }}
    </p>
  </Panel>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  who: string;
}

const props = defineProps<Props>();
</script>
