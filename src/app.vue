<script setup lang="ts">
const { $trpc } = useNuxtApp();

const createdChat = await $trpc.chat.createOne.mutate();

const msg = await $trpc.chat.addMessage.mutate({
  chatId: createdChat.id,
  text: 'Hello, World!',
  who: 'user',
});

const chat = await $trpc.chat.getOne.query({ id: createdChat.id });
</script>

<template>
  <div>
    {{ chat }}
  </div>
</template>
