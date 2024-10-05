<script setup lang="ts">
const { $trpc } = useNuxtApp();

const createdChat = await $trpc.chat.createOne.mutate();
console.log(createdChat);
</script>

<template>
  <div>
    <Logo />

    <div class="h-screen flex items-center justify-center">
      <ModelInput />
    </div>
  </div>
</template>

<style scoped></style>
